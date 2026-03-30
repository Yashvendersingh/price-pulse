from ml_model import predict_price

def suggest_price(base_price, comp_price, demand, stock=50):
    """
    V7 ML-Powered Pricing Engine
    
    Uses the GradientBoosting model trained on competitor-anchored,
    demand-linear synthetic data. Falls back to deterministic formula
    only if the ML model fails.
    """
    base_price = float(base_price)
   
    if comp_price is None or comp_price == 0:
        comp_price = base_price
    else:
        comp_price = float(comp_price)
    
    demand = float(demand)
    stock = int(stock)
    
    try:
        # Use ML Model (V7 GradientBoosting)
        recommended_price = predict_price(comp_price, demand, stock, base_price)
        
        # --- POST-PROCESSING RULE ---
        # The ML model strictly follows the dataset (which averages ~94.6% of comp price at 50% demand).
        # We apply an adjustment to "nudge" the ML price toward the user's business logic:
        # User Logic: 50% demand = 100% of minimum competitor price.
        user_ideal_ratio = 0.90 + (0.20 * demand) # 10% demand = 0.92, 50% = 1.00, 90% = 1.08
        ml_ratio = float(recommended_price) / comp_price
        
        # Blend the raw ML ratio and the User Ideal ratio (70% weight to ideal logic to ensure strict adherence)
        adjusted_ratio = (0.3 * ml_ratio) + (0.7 * user_ideal_ratio)
        recommended_price = comp_price * adjusted_ratio
        
    except Exception as e:
        print(f"ML Model Error (Using Fallback): {e}")
        # Deterministic Fallback
        demand_multiplier = 0.97 + (0.06 * demand)
        recommended_price = comp_price * demand_multiplier

    # Safety constraints: never below 85% and never above 150% of base price
    min_floor = base_price * 0.85
    max_ceiling = base_price * 1.50
    
    final_price = max(recommended_price, min_floor)
    final_price = min(final_price, max_ceiling)
    
    final_price = round(final_price)
    
    return {
        "competitor_price": comp_price,
        "ml_price": float(recommended_price),
        "final_price": final_price
    }