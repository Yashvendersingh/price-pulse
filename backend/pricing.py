from ml_model import predict_price

from ml_model import predict_price

def suggest_price(base_price, comp_price, demand):

    # safety check
    if comp_price is None:
        comp_price = base_price

    # calculate price difference
    price_diff = comp_price - base_price

    # ML prediction
    predicted_price = predict_price(comp_price, demand, base_price)

    # Let the ML model dictate the final price completely without artificial markup
    final_price = predicted_price

    return {
        "competitor_price": comp_price,
        "price_diff": price_diff,
        "ml_price": predicted_price,
        "final_price": final_price
    }