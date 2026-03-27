# import mysql.connector
from flask import Flask, jsonify
from pricing import suggest_price
# from db import conn, cursor  # commented out

app = Flask(__name__)

# Mock data
mock_products = [
    {
        "product_id": 1,
        "product_name": "Laptop",
        "base_price": 50000,
        "demand": 0.8,
        "stock": 10,
        "your_price": 50000,
        "competitor_price": 48000,
        "suggested_price": 51000,
    },
    {
        "product_id": 2,
        "product_name": "Mouse",
        "base_price": 500,
        "demand": 0.6,
        "stock": 50,
        "your_price": 500,
        "competitor_price": 450,
        "suggested_price": 520,
    }
]

mock_competitors = [
    {"product_id": 1, "price": 48000},
    {"product_id": 2, "price": 450}
]

mock_history = [
    {"product_id": 1, "price": 50000, "timestamp": "2023-01-01"},
    {"product_id": 1, "price": 51000, "timestamp": "2023-02-01"},
    {"product_id": 1, "price": 52000, "timestamp": "2023-03-01"},
]

@app.route("/dashboard")
def dashboard():
    # Mock dashboard
    return jsonify({
        "status": "success",
        "data": mock_products
    })

@app.route("/competitors/<int:product_id>")
def get_competitors(product_id):
    # Mock competitors
    comps = [c for c in mock_competitors if c["product_id"] == product_id]
    return jsonify({
        "status": "success",
        "data": comps
    })

@app.route("/comparison/<int:product_id>")
def compare_price(product_id):
    product = next((p for p in mock_products if p["product_id"] == product_id), None)
    if not product:
        return jsonify({"status": "error", "message": "Product not found"}), 404

    comps = [c for c in mock_competitors if c["product_id"] == product_id]
    if not comps:
        return jsonify({"status": "error", "message": "Competitor not found"}), 404

    your_price = product["your_price"]
    comp_price = min(c["price"] for c in comps)
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
    product = next((p for p in mock_products if p["product_id"] == product_id), None)
    if not product:
        return jsonify({"status": "error", "message": "Product not found"}), 404

    comps = [c for c in mock_competitors if c["product_id"] == product_id]
    comp_price = min(c["price"] for c in comps) if comps else None

    result = suggest_price(product["base_price"], comp_price, product["demand"])

    # Mock save history
    mock_history.append({
        "product_id": product_id,
        "price": result["final_price"],
        "timestamp": "2023-04-01"
    })

    return jsonify({
        "status": "success",
        "data": result
    })

@app.route("/history/<int:product_id>")
def get_history(product_id):
    history = [h for h in mock_history if h["product_id"] == product_id]
    return jsonify({
        "status": "success",
        "data": history
    })

# Run server
if __name__ == "__main__":
    app.run(debug=True)