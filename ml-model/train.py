"""
Price Pulse ML Training Pipeline V8
=====================================
1. Model      : RandomForestRegressor
2. Outliers   : Dual detection (IQR + Z-Score)
3. Logic      : Demand ↑ = Price ↑,  Demand ↓ = Price ↓
"""

import pandas as pd
import numpy as np
import joblib
import os
from scipy import stats
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. LOAD DATA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print("=" * 60)
print("  Price Pulse ML Training Pipeline V8")
print("=" * 60)

data_path = "model/realistic_pricing_dataset.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Dataset not found at {data_path}")

df = pd.read_csv(data_path)
print(f"\n📂 Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# Drop rows with missing critical values
df = df.dropna(subset=['base_price', 'competitor_price', 'demand', 'target_price'])
print(f"   After dropping NaNs: {df.shape[0]} rows")

# Ensure numeric types
numeric_cols = ['base_price', 'competitor_price', 'demand', 'stock', 'is_holiday', 'target_price']
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')
df = df.dropna(subset=numeric_cols)
print(f"   After ensuring numeric types: {df.shape[0]} rows")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. OUTLIER DETECTION — Dual Method (IQR + Z-Score)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Example problem: base_price = 56000, competitor_price = 5600
# That's clearly a typo/bad data. Both IQR and Z-Score catch this.

print(f"\n🔍 Outlier Detection (IQR + Z-Score):")
rows_before = len(df)

# Calculate the ratio between competitor_price and base_price
# A healthy ratio should be roughly 0.8 to 1.2 (within 20% of each other)
df['comp_base_ratio'] = df['competitor_price'] / df['base_price']
df['target_comp_ratio'] = df['target_price'] / df['competitor_price']

# --- METHOD 1: Interquartile Range (IQR) ---
def iqr_filter(series, label):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    mask = (series >= lower) & (series <= upper)
    removed = (~mask).sum()
    print(f"   IQR on {label}: Q1={Q1:.3f}, Q3={Q3:.3f}, IQR={IQR:.3f}")
    print(f"     Bounds: [{lower:.3f}, {upper:.3f}] — removed {removed} rows")
    return mask

iqr_mask_1 = iqr_filter(df['comp_base_ratio'], 'comp/base ratio')
iqr_mask_2 = iqr_filter(df['target_comp_ratio'], 'target/comp ratio')

# --- METHOD 2: Z-Score ---
def zscore_filter(series, label, threshold=3):
    z_scores = np.abs(stats.zscore(series, nan_policy='omit'))
    mask = z_scores < threshold
    removed = (~mask).sum()
    print(f"   Z-Score on {label}: threshold={threshold}, removed {removed} rows")
    return mask

zscore_mask_1 = zscore_filter(df['comp_base_ratio'], 'comp/base ratio')
zscore_mask_2 = zscore_filter(df['target_comp_ratio'], 'target/comp ratio')
zscore_mask_3 = zscore_filter(df['base_price'], 'base_price')

# Combine all masks — a row must pass BOTH methods to survive
combined_mask = iqr_mask_1 & iqr_mask_2 & zscore_mask_1 & zscore_mask_2 & zscore_mask_3
df = df[combined_mask]

# Drop the temporary ratio columns
df = df.drop(columns=['comp_base_ratio', 'target_comp_ratio'])

rows_after = len(df)
print(f"\n   ✅ Outlier Summary: {rows_before} → {rows_after} rows ({rows_before - rows_after} removed)")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. FEATURE ENGINEERING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# comp_x_demand: interaction feature so the model learns that
# demand MULTIPLIES against competitor price (demand ↑ = price ↑)
df['comp_x_demand'] = df['competitor_price'] * df['demand']

feature_cols = ['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price', 'comp_x_demand']

X = df[feature_cols]
y = df['target_price']

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. TRAIN / TEST SPLIT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"\n📊 Split: {len(X_train)} train / {len(X_test)} test")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. BUILD & TRAIN — RandomForestRegressor
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print("\n🚀 Training RandomForestRegressor (200 trees)...")
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1  # Use all CPU cores for speed
    ))
])

pipeline.fit(X_train, y_train)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 6. EVALUATE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
y_pred = pipeline.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n{'='*60}")
print(f"  MODEL EVALUATION RESULTS")
print(f"{'='*60}")
print(f"  Algorithm    : RandomForestRegressor")
print(f"  Trees        : 200")
print(f"  Max Depth    : 12")
print(f"  Train Size   : {len(X_train)}")
print(f"  Test Size    : {len(X_test)}")
print(f"  MAE          : Rs.{mae:.2f}")
print(f"  R2 Score     : {r2:.6f} ({r2*100:.2f}%)")
print(f"{'='*60}")

# Feature Importances
importances = pipeline.named_steps['regressor'].feature_importances_
print(f"\n📈 Feature Importances:")
for fname, imp in sorted(zip(feature_cols, importances), key=lambda x: -x[1]):
    bar = "█" * int(imp * 50)
    print(f"   {fname:20s} {imp:.4f}  {bar}")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 7. SANITY CHECKS — Demand ↑ = Price ↑
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n🧪 Demand Sensitivity Test (comp=43500, base=45000):")
print(f"   {'Demand':>8s}  {'Predicted':>12s}  {'Direction':>10s}")
print(f"   {'─'*8}  {'─'*12}  {'─'*10}")

prev_price = 0
for d in [0.05, 0.15, 0.30, 0.50, 0.70, 0.85, 0.95]:
    row = pd.DataFrame([{
        'competitor_price': 43500,
        'demand': d,
        'stock': 50,
        'is_holiday': 0,
        'base_price': 45000,
        'comp_x_demand': 43500 * d
    }])
    pred = pipeline.predict(row)[0]
    direction = "↑" if pred > prev_price else ("↓" if pred < prev_price else "→")
    if prev_price == 0:
        direction = "—"
    print(f"   {d:>7.0%}  Rs.{pred:>10,.0f}  {direction:>10s}")
    prev_price = pred

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 8. SAVE MODEL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
joblib.dump(pipeline, "model.pkl.gz", compress=("gzip", 3))
joblib.dump(pipeline, "model.pkl")
print(f"\n✅ Model saved as model.pkl and model.pkl.gz")
print(f"   Pipeline: StandardScaler -> RandomForestRegressor(200 trees)")
