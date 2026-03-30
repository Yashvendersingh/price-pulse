import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

# 1. LOAD CLEAN DATA
df = pd.read_csv("data/pricing_dataset.csv")

# OUTLIER DETECTION (IQR Method)
print(f"Original dataset shape: {df.shape}")
num_cols = ['base_price', 'competitor_price', 'demand']
for col in num_cols:
    if col in df.columns:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
print(f"Dataset shape after outlier removal: {df.shape}")

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

# RIGID TESTING: K-Fold Cross Validation
print("\nPerforming Rigid Testing (5-Fold Cross Validation)...")
kf = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(pipeline, X, y, cv=kf, scoring='r2')
cv_mae_scores = -cross_val_score(pipeline, X, y, cv=kf, scoring='neg_mean_absolute_error')

print(f"Cross-Validation R2 Scores: {cv_scores}")
print(f"Average CV R2: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
print(f"Cross-Validation MAE Scores: {cv_mae_scores}")
print(f"Average CV MAE: ${cv_mae_scores.mean():.2f}")

print("\nTraining final model...")
pipeline.fit(X_train, y_train)

# 5. EVALUATE
y_pred = pipeline.predict(X_test)
print("\n--- Final Model Performance on Test Set ---")
print(f"MAE: ${mean_absolute_error(y_test, y_pred):.2f} (Average prediction error margin)")
print(f"R2 Score: {r2_score(y_test, y_pred):.4f} (Closer to 1.0 is better)")

# 6. SAVE COMPRESSED PIPELINE
model_path = "model.pkl.gz"
joblib.dump(pipeline, model_path, compress=("gzip", 3))
print(f"\n✅ Ready for production! New pipeline saved to {model_path}")
