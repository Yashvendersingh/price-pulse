import joblib
import pandas as pd
import os

model_path = os.path.join(os.path.dirname(__file__), "../ml-model/model.pkl")
pipeline = joblib.load(model_path)

def predict_price(comp_price, demand, stock, base_price, is_holiday=0):
    """
    Features: [competitor_price, demand, stock, is_holiday, base_price]
    """
    
    cols = ['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price']
    features = pd.DataFrame([
        [float(comp_price), float(demand), int(stock), int(is_holiday), float(base_price)]
    ], columns=cols)
    
  
    prediction = pipeline.predict(features)[0]
    
    return float(prediction)