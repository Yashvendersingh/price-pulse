import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

n = 100000  # increase up to 200k if needed

categories = {
    "grocery": (100, 2000),
    "fashion": (300, 8000),
    "electronics": (2000, 120000),
    "appliances": (5000, 150000),
    "books": (100, 3000),
    "beauty": (150, 5000),
    "furniture": (8000, 200000),
    "sports": (500, 25000)
}

start_date = datetime(2022, 1, 1)

rows = []

for i in range(n):

    # --- TIME ---
    date = start_date + timedelta(days=np.random.randint(0, 730))
    day_of_week = date.weekday()
    month = date.month

    # seasonality (festive boost)
    festive = 1 if month in [10, 11, 12] else 0

    # --- CATEGORY ---
    category = np.random.choice(list(categories.keys()))
    min_p, max_p = categories[category]

    # --- BASE PRICE ---
    base_price = np.random.uniform(min_p, max_p)

    # --- COMPETITOR PRICE (dynamic + drift) ---
    comp_variation = np.random.normal(0, base_price * 0.15)
    competitor_price = max(50, base_price + comp_variation)

    # --- DEMAND (depends on time + randomness) ---
    base_demand = np.random.beta(2, 2)

    # weekend boost
    if day_of_week >= 5:
        base_demand += 0.1

    # festive boost
    if festive:
        base_demand += 0.15

    demand = np.clip(base_demand, 0, 1)

    # --- STOCK ---
    stock = np.random.randint(0, 500)

    # --- HOLIDAY FLAG ---
    is_holiday = 1 if (festive and np.random.rand() < 0.6) else 0

    # --- RATING ---
    rating = round(np.random.uniform(2.5, 5.0), 1)

    # --- PROMOTION ---
    is_promo = 1 if np.random.rand() < 0.2 else 0
    discount_percent = np.random.uniform(5, 40) if is_promo else 0

    # --- DEMAND ELASTICITY ---
    demand_factor = 1 + ((demand - 0.5) * 0.25)

    # --- STOCK EFFECT ---
    if stock < 20:
        stock_factor = 1.08
    elif stock > 350:
        stock_factor = 0.92
    else:
        stock_factor = 1.0

    # --- HOLIDAY EFFECT ---
    holiday_factor = 1.10 if is_holiday else 1.0

    # --- RATING EFFECT ---
    rating_factor = 1 + ((rating - 4.0) * 0.04)

    # --- PROMO EFFECT ---
    promo_factor = 1 - (discount_percent / 100)

    # --- MAIN ANCHOR (COMPETITOR DRIVEN) ---
    adjusted_comp_price = competitor_price * demand_factor * stock_factor * holiday_factor * rating_factor

    target_price = (adjusted_comp_price * 0.80) + (base_price * 0.20)

    # apply promo
    target_price *= promo_factor

    # --- NOISE (REAL WORLD UNCERTAINTY) ---
    noise = np.random.normal(0, target_price * 0.04)
    target_price += noise

    # --- OUTLIERS (rare spikes/crashes) ---
    if np.random.rand() < 0.01:
        target_price *= np.random.uniform(0.5, 1.5)

    target_price = max(50, target_price)

    # --- MISSING VALUES ---
    if np.random.rand() < 0.03:
        demand = None
    if np.random.rand() < 0.02:
        competitor_price = None

    rows.append([
        date.strftime("%Y-%m-%d"),
        category,
        round(base_price, 2),
        None if competitor_price is None else round(competitor_price, 2),
        None if demand is None else round(demand, 2),
        stock,
        is_holiday,
        rating,
        is_promo,
        round(discount_percent, 2),
        round(target_price, 2)
    ])

df = pd.DataFrame(rows, columns=[
    "date",
    "category",
    "base_price",
    "competitor_price",
    "demand",
    "stock",
    "is_holiday",
    "rating",
    "is_promo",
    "discount_percent",
    "target_price"
])

df.to_csv("realistic_pricing_dataset.csv", index=False)

print("realistic dataset created 🚀")
print(df.head())