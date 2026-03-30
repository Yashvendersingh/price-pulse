from flask import Flask, jsonify, g, request
from flask_cors import CORS
from pricing import suggest_price
from db import get_db_connection
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.before_request
def setup_db():
    # Open connection to Neon per request
    g.conn = get_db_connection()
    g.cursor = g.conn.cursor()

@app.teardown_request
def teardown_db(exception):
    # Close connection properly after request is complete
    cursor = getattr(g, 'cursor', None)
    if cursor is not None:
        cursor.close()
    conn = getattr(g, 'conn', None)
    if conn is not None:
        conn.close()


@app.route("/dashboard")
def dashboard():

    g.cursor.execute("SELECT * FROM products")
    products = g.cursor.fetchall()

    g.cursor.execute("SELECT * FROM competitors")
    all_competitors = g.cursor.fetchall()

    from collections import defaultdict
    comp_map = defaultdict(list)
    for c in all_competitors:
        comp_map[c["product_id"]].append(c)

    result = []

    for p in products:

        # get all competitors from pre-fetched map
        competitors = comp_map.get(p["product_id"], [])

        # handle multiple competitors
        if competitors:
            prices = [c["price"] for c in competitors]
            comp_price = min(prices)
        else:
            comp_price = None

        # pricing logic
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


@app.route("/competitors/<int:product_id>")
def get_competitors(product_id):

    g.cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    data = g.cursor.fetchall()

    return jsonify({"status": "success", "data": data})


@app.route("/comparison/<int:product_id>")
def compare_price(product_id):

    g.cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    product = g.cursor.fetchone()

    g.cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    competitors = g.cursor.fetchall()

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


@app.route("/recommendation/<int:product_id>")
def recommendation(product_id):

    g.cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    product = g.cursor.fetchone()

    g.cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    competitors = g.cursor.fetchall()

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

    g.cursor.execute(
        "INSERT INTO price_history (product_id, price, timestamp) VALUES (%s, %s, %s)",
        (product_id, result["final_price"], datetime.now())
    )
    g.conn.commit()

    return jsonify({"status": "success", "data": result})


@app.route("/history/<int:product_id>")
def get_history(product_id):

    g.cursor.execute(
        "SELECT price, timestamp FROM price_history WHERE product_id = %s ORDER BY timestamp DESC",
        (product_id,)
    )
    rows = g.cursor.fetchall()

    data = [
        {"price": r["price"], "timestamp": r["timestamp"].isoformat()}
        for r in rows
    ]

    return jsonify({"status": "success", "data": data})


@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    
    product_name = data.get("product_name", "Test Product")
    base_price = float(data.get("base_price", 0))
    
    # NEW: Handle Multiple Competitor Prices (Comma Separated)
    comp_input = str(data.get("competitor_price", "0"))
    try:
        # Split by comma, strip whitespace, and handle empty values
        comp_prices = [float(p.strip()) for p in comp_input.split(",") if p.strip()]
        comp_price = min(comp_prices) if comp_prices else base_price
    except ValueError:
        comp_price = base_price

    # NEW: Adjustable Demand (Stock is now a fixed background neutral 50)
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

if __name__ == "__main__":
    app.run(debug=True)