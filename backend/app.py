from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model
model = joblib.load("../ml-model/model.pkl")

@app.route("/")
def home():
    return "Price Pulse Backend Running"

@app.route("/predict", methods=["GET", "POST"])
def predict():

    if request.method == "POST":
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        competitor_price = data.get("competitor_price")
        demand = data.get("demand")

    else:
        competitor_price = request.args.get("competitor_price")
        demand = request.args.get("demand")

    # ✅ VALIDATION (VERY IMPORTANT)
    if competitor_price is None or demand is None:
        return jsonify({"error": "Missing input values"}), 400

    competitor_price = float(competitor_price)
    demand = float(demand)

    price_diff = 0
    features = np.array([[competitor_price, demand, price_diff]])

    ml_price = model.predict(features)[0]

    if demand > 300:
        final_price = ml_price * 1.05
    else:
        final_price = ml_price * 0.98

    return jsonify({
        "recommended_price": float(final_price),
        "ml_price": float(ml_price),
        "competitor_price": competitor_price,
        "demand": demand
    })

if __name__ == "__main__":
    app.run(debug=True)