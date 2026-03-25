from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

# load model
model = joblib.load("model.pkl")

@app.get("/")
def home():
    return {"message": "Price Pulse API running"}

@app.get("/predict")
def predict(competitor_price: float, demand: float):

    price_diff = 0

    features = np.array([[competitor_price, demand, price_diff]])

    ml_price = model.predict(features)[0]

    # rule-based adjustment
    if demand > 300:
        final_price = ml_price * 1.05
    else:
        final_price = ml_price * 0.98

    return {
        "recommended_price": float(final_price),
        "ml_price": float(ml_price),
        "competitor_price": competitor_price,
        "demand": demand
    }