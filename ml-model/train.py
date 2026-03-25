import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# =========================
# 1. LOAD DATA
# =========================

amazon = pd.read_csv("data/amazon.csv")
walmart = pd.read_csv("data/walmart.csv")

print("datasets loaded")

# =========================
# 2. CLEAN AMAZON DATA
# =========================

# rename price column
amazon.rename(columns={'actual_price': 'price'}, inplace=True)

# clean ₹ symbol
amazon['price'] = amazon['price'].replace('[₹,]', '', regex=True).astype(float)

# simulate competitor price
amazon['competitor_price'] = amazon['price'] * np.random.uniform(0.9, 1.1, size=len(amazon))

# =========================
# 3. CLEAN WALMART DATA
# =========================

# use Weekly_Sales as demand
walmart.rename(columns={'Weekly_Sales': 'demand'}, inplace=True)

# normalize demand (important)
walmart['demand'] = walmart['demand'] / 1000

# =========================
# 4. MERGE DATA
# =========================

min_len = min(len(amazon), len(walmart))

data = pd.DataFrame({
    'price': amazon['price'][:min_len],
    'competitor_price': amazon['competitor_price'][:min_len],
    'demand': walmart['demand'][:min_len]
})

data = data.dropna()

# =========================
# 5. FEATURE ENGINEERING
# =========================

data['price_diff'] = data['competitor_price'] - data['price']

# =========================
# 6. MODEL INPUT
# =========================

X = data[['competitor_price', 'demand', 'price_diff']]
y = data['price']

# =========================
# 7. TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 8. TRAIN MODEL
# =========================

model = RandomForestRegressor(n_estimators=150, random_state=42)
model.fit(X_train, y_train)

print("model trained successfully")

# =========================
# 9. EVALUATION
# =========================

y_pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2:", r2_score(y_test, y_pred))

# =========================
# 10. SAVE MODEL
# =========================

joblib.dump(model, "model.pkl")
print("model saved as model.pkl")