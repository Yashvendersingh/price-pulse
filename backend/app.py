import os
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from pricing import suggest_price
from db import get_db_connection
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Production CORS — allow frontend origin
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
CORS(app, origins=ALLOWED_ORIGINS)


def get_cursor():
    if not hasattr(g, 'conn') or g.conn is None:
        g.conn = get_db_connection()
    if not hasattr(g, 'cursor') or g.cursor is None:
        g.cursor = g.conn.cursor()
    return g.cursor


@app.teardown_request
def teardown_db(exception):
    cursor = getattr(g, 'cursor', None)
    if cursor is not None:
        cursor.close()
    conn = getattr(g, 'conn', None)
    if conn is not None:
        conn.close()


# --- Health Check (for Render / uptime monitors) ---
@app.route("/")
def health():
    return jsonify({"status": "ok", "service": "price-pulse-api"})


@app.route("/dashboard")
def dashboard():
    try:
        cursor = get_cursor()
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()

        cursor.execute("SELECT * FROM competitors")
        all_competitors = cursor.fetchall()

        from collections import defaultdict
        comp_map = defaultdict(list)
        for c in all_competitors:
            comp_map[c["product_id"]].append(c)

        result = []

        for p in products:
            competitors = comp_map.get(p["product_id"], [])

            if competitors:
                prices = [c["price"] for c in competitors]
                comp_price = min(prices)
            else:
                comp_price = None

            pricing = suggest_price(p["base_price"], comp_price, p["demand"], p["stock"])

            result.append({
                "product_id": p["product_id"],
                "product_name": p["product_name"],
                "your_price": p["base_price"],
                "competitor_price": comp_price,
                "suggested_price": pricing["final_price"],
                "demand": p["demand"],
                "stock": p["stock"]
            })

        return jsonify({"status": "success", "data": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/competitors/<int:product_id>")
def get_competitors(product_id):
    try:
        cursor = get_cursor()
        cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
        data = cursor.fetchall()
        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/comparison/<int:product_id>")
def compare_price(product_id):
    try:
        cursor = get_cursor()
        cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
        product = cursor.fetchone()

        cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
        competitors = cursor.fetchall()

        if not product:
            return jsonify({"status": "error", "message": "Product not found"}), 404

        if not competitors:
            return jsonify({"status": "error", "message": "Competitor not found"}), 404

        your_price = product["base_price"]
        prices = [c["price"] for c in competitors]
        comp_price = min(prices)
        price_gap = your_price - comp_price

        return jsonify({
            "status": "success",
            "data": {
                "product_name": product["product_name"],
                "your_price": your_price,
                "competitor_price": comp_price,
                "price_gap": price_gap,
                "cheapest": your_price < comp_price
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/recommendation/<int:product_id>")
def recommendation(product_id):
    try:
        cursor = get_cursor()
        cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
        product = cursor.fetchone()

        cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
        competitors = cursor.fetchall()

        if not product:
            return jsonify({"status": "error", "message": "Product not found"}), 404

        base_price = product["base_price"]
        demand = product["demand"]

        if competitors:
            prices = [c["price"] for c in competitors]
            comp_price = min(prices)
        else:
            comp_price = None

        result = suggest_price(base_price, comp_price, demand, product["stock"])

        cursor.execute(
            "INSERT INTO price_history (product_id, price, timestamp) VALUES (%s, %s, %s)",
            (product_id, result["final_price"], datetime.now())
        )
        g.conn.commit()

        return jsonify({"status": "success", "data": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/history/<int:product_id>")
def get_history(product_id):
    try:
        cursor = get_cursor()
        cursor.execute(
            "SELECT price, timestamp FROM price_history WHERE product_id = %s ORDER BY timestamp DESC",
            (product_id,)
        )
        rows = cursor.fetchall()

        data = [
            {"price": r["price"], "timestamp": r["timestamp"].isoformat()}
            for r in rows
        ]

        return jsonify({"status": "success", "data": data})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        data = request.get_json()

        product_name = data.get("product_name", "Test Product")
        base_price = float(data.get("base_price", 0))

        comp_input = str(data.get("competitor_price", "0"))
        try:
            comp_prices = [float(p.strip()) for p in comp_input.split(",") if p.strip()]
            comp_price = min(comp_prices) if comp_prices else base_price
        except ValueError:
            comp_price = base_price

        demand = float(data.get("demand", 0.5))
        stock = 50

        result = suggest_price(base_price, comp_price, demand, stock)

        return jsonify({
            "status": "success",
            "data": {
                "product_name": product_name,
                "suggested_price": result["final_price"],
                "comp_price_used": comp_price,
                "status": "Increase 📈" if result["final_price"] > base_price else "Decrease 📉"
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)