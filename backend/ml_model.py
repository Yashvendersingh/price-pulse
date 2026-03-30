import joblib
import pandas as pd
import os

# Production: Compressed Model (.gz) allows for easy GitHub deployment (<100MB limit)
model_path = os.path.join(os.path.dirname(__file__), "../ml-model/model.pkl.gz")

# Fallback: Uncompressed Model for local dev if compressed isn't generated yet
if not os.path.exists(model_path):
    model_path = os.path.join(os.path.dirname(__file__), "../ml-model/model.pkl")

try:
    pipeline = joblib.load(model_path)
    print("✅ ML Model loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Could not load ML model: {e}")
    pipeline = None

def predict_price(comp_price, demand, stock, base_price, is_holiday=0):
    if pipeline is None:
        raise RuntimeError("ML model pipeline is not loaded.")
        
    cols = ['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price']
    features = pd.DataFrame([
        [float(comp_price), float(demand), int(stock), int(is_holiday), float(base_price)]
    ], columns=cols)
    
    prediction = pipeline.predict(features)[0]
    
    return float(prediction)
