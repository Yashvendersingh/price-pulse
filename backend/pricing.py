from ml_model import predict_price

def suggest_price(base_price, comp_price, demand, stock=50):
    """
    V6.0 Machine Learning Engine
    
    This replaces the V5 deterministic formula with actual ML predictions.
    Falls back to deterministic safely if ML model fails to load.
    """
    base_price = float(base_price)
   
    if comp_price is None or comp_price == 0:
        comp_price = base_price
    else:
        comp_price = float(comp_price)
    
    demand = float(demand)
    stock = int(stock)
    
    try:
        # Use ML Model
        recommended_price = predict_price(comp_price, demand, stock, base_price)
    except Exception as e:
        print(f"ML Model Error (Using Fallback): {e}")
        # V5.1 Fallback Formula
        demand_multiplier = 0.97 + (0.06 * demand)
        recommended_price = comp_price * demand_multiplier

    min_floor = base_price * 0.85
    final_price = max(recommended_price, min_floor)
    
    final_price = round(final_price)
    
    return {
        "competitor_price": comp_price,
        "ml_price": float(recommended_price),
        "final_price": final_price
    }