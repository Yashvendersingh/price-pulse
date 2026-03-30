import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

# 1. LOAD CLEAN DATA
df = pd.read_csv("data/pricing_dataset.csv")

# Optional: If your dataset doesn't have a 'target_price' column, 
# you can use your pricing rules here to generate it dynamically.
# If you DO have target_price in the CSV, completely delete this block.
if 'target_price' not in df.columns:
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


# 2. SELECT FEATURES & LABELS
X = df[['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price']]
y = df['target_price']

# 3. TRAIN/TEST SPLIT
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. BUILD & TRAIN PIPELINE
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', RandomForestRegressor(n_estimators=200, random_state=42))
])

print("Training model...")
pipeline.fit(X_train, y_train)

# 5. EVALUATE
y_pred = pipeline.predict(X_test)
print("\n--- Model Performance ---")
print(f"MAE: ${mean_absolute_error(y_test, y_pred):.2f} (Average prediction error margin)")
print(f"R2 Score: {r2_score(y_test, y_pred):.4f} (Closer to 1.0 is better)")

# 6. SAVE COMPRESSED PIPELINE
model_path = "model.pkl.gz"
joblib.dump(pipeline, model_path, compress=("gzip", 3))
print(f"\n✅ Ready for production! New pipeline saved to {model_path}")
