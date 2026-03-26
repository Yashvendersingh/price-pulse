import joblib

# load model once
model = joblib.load("../ml-model/model.pkl")

def predict_price(comp_price, demand, base_price):
    
    # calculate required feature
    price_diff = comp_price - base_price

    # model expects: [competitor_price, demand, price_diff]
    features = [[comp_price, demand, price_diff]]

    prediction = model.predict(features)[0]

    return float(prediction)