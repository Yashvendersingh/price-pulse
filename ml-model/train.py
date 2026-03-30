import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

# 1. LOAD DATA
amazon = pd.read_csv("data/amazon.csv")
walmart = pd.read_csv("data/Walmart.csv")

# Clean prices
amazon.rename(columns={'actual_price': 'base_price'}, inplace=True)
amazon['base_price'] = amazon['base_price'].replace('[₹,]', '', regex=True).astype(float)

# Use Walmart Sales as Demand
walmart.rename(columns={'Weekly_Sales': 'demand'}, inplace=True)
walmart['demand'] = walmart['demand'] / 100000 


min_len = min(len(amazon), len(walmart))
df = pd.DataFrame({
    'base_price': amazon['base_price'][:min_len],
    'demand': walmart['demand'][:min_len],
    'is_holiday': walmart['Holiday_Flag'][:min_len].astype(int)
})

np.random.seed(42)
df['stock'] = np.random.randint(0, 100, size=len(df))

df['competitor_price'] = df['base_price'] * np.random.uniform(0.9, 1.1, size=len(df))

def calculate_target(row):
    base = float(row['base_price'])
    comp = float(row['competitor_price'])
    demand = float(row['demand'])
    holiday = int(row['is_holiday'])

 
    demand_multiplier = 0.92 + (0.20 * demand)
    target = base * demand_multiplier

    if comp < target:
        if demand < 0.8:
            target = max(comp * 0.99, base * 0.85)
        else:
        
            target = target 


    if holiday == 1 and demand > 0.4:
        target = max(target, base * 1.05)

    return target

df['target_price'] = df.apply(calculate_target, axis=1)

# 3. OUTLIER TREATMENT

df['target_price'] = np.clip(df['target_price'], df['base_price'] * 0.7, df['base_price'] * 1.3)

# 4. TRAINING

X = df[['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price']]
y = df['target_price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', RandomForestRegressor(n_estimators=200, random_state=42))
])

pipeline.fit(X_train, y_train)
print(f"DEBUG: Trained model with {pipeline.named_steps['regressor'].n_features_in_} features")

# 5. EVALUATION
y_pred = pipeline.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, y_pred)}")
print(f"R2 Score: {r2_score(y_test, y_pred)}")

# 6. SAVE PIPELINE
# Compress level 3 shrinks models ~75% so we can easily push past GitHub's limits
joblib.dump(pipeline, "model.pkl.gz", compress=("gzip", 3))
print("🔥 Strategic Pipeline saved as compressed model.pkl.gz")