import mysql.connector
from flask import Flask, jsonify
from pricing import suggest_price
from db import conn, cursor

app = Flask(__name__)

@app.route("/dashboard")
def dashboard():

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    result = []

    for p in products:

        # get all competitors
        cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (p["product_id"],))
        competitors = cursor.fetchall()

        # handle multiple competitors
        if competitors:
            prices = [c["price"] for c in competitors]
            comp_price = min(prices)
        else:
            comp_price = None

        # pricing logic
        from pricing import suggest_price
        pricing = suggest_price(p["base_price"], comp_price, p["demand"])

        result.append({
            "product_id": p["product_id"],
            "product_name": p["product_name"],
            "your_price": p["base_price"],
            "competitor_price": comp_price,
            "suggested_price": pricing["final_price"],
            "demand": p["demand"],
            "stock": p["stock"]
        })

    return jsonify({
        "status": "success",
        "data": result
    })

@app.route("/competitors/<int:product_id>")
def get_competitors(product_id):

    cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    data = cursor.fetchall()

    return jsonify({
        "status": "success",
        "data": data
    })

@app.route("/comparison/<int:product_id>")
def compare_price(product_id):

    # get product
    cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    product = cursor.fetchone()

    # get competitors
    cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    competitors = cursor.fetchall()

    if not product:
        return jsonify({"status": "error", "message": "Product not found"}), 404

    if not competitors:
        return jsonify({"status": "error", "message": "Competitor not found"}), 404

    your_price = product["base_price"]

    # extract all competitor prices
    prices = [c["price"] for c in competitors]
    comp_price = min(prices)   # choose cheapest

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

    # get product (ONLY ONE)
    cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    product = cursor.fetchone()

    # get competitors (MULTIPLE)
    cursor.execute("SELECT * FROM competitors WHERE product_id = %s", (product_id,))
    competitors = cursor.fetchall()

    if not product:
        return jsonify({"status": "error", "message": "Product not found"}), 404

    # extract values
    base_price = product["base_price"]
    demand = product["demand"]

    # handle multiple competitors
    if competitors:
        prices = [c["price"] for c in competitors]
        comp_price = min(prices)
    else:
        comp_price = None

    # ML + pricing logic
    result = suggest_price(base_price, comp_price, demand)

    # save history
    from datetime import datetime
    cursor.execute("""
    INSERT INTO price_history (product_id, price, timestamp)
    VALUES (%s, %s, %s)
    """, (product_id, result["final_price"], datetime.now()))

    conn.commit()

    return jsonify({
    "status": "success",
    "data": result
    })

# Run server x
if __name__ == "__main__":
    app.run(debug=True)