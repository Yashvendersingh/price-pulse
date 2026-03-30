def suggest_price(base_price, comp_price, demand, stock=50):
    """
    V5.1 Deterministic Pricing Engine
    
    Core Formula: recommended = min_competitor * (0.97 + 0.06 * demand)
    
    This ensures:
    - Price is ALWAYS anchored to the MINIMUM competitor price
    - Demand increase -> Price increase (linear, guaranteed)
    - Demand decrease -> Price decrease (linear, guaranteed)
    - At demand=0.0 -> 3% below competitor (aggressive undercut)
    - At demand=0.5 -> exactly at competitor price
    - At demand=1.0 -> 3% above competitor (premium surge)
    """
    base_price = float(base_price)
   
    if comp_price is None or comp_price == 0:
        comp_price = base_price
    else:
        comp_price = float(comp_price)
    
    demand = float(demand)
    
    demand_multiplier = 0.97 + (0.06 * demand)
    recommended_price = comp_price * demand_multiplier
    

    min_floor = base_price * 0.85
    final_price = max(recommended_price, min_floor)
    
   
    final_price = round(final_price)
    
    return {
        "competitor_price": comp_price,
        "ml_price": recommended_price,
        "final_price": final_price
    }