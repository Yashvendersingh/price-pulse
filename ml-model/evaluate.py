import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, r2_score

def evaluate_model():
    print("📈 Starting Evaluation...")
    
    # 1. Load data and model
    try:
        pipeline = joblib.load("model.pkl.gz")
   
        df = pd.read_csv("data/pricing_dataset.csv")
        
        # Test Features
        X_test = df[['competitor_price', 'demand', 'stock', 'is_holiday', 'base_price']]
        y_pred = pipeline.predict(X_test)
        
        # 2. Plotting
        plt.figure(figsize=(15, 6))
        
        # Subplot 1: Price Distribution
        plt.subplot(1, 2, 1)
        sns.histplot(y_pred, color='blue', label='Predicted', kde=True)
        sns.histplot(df['base_price'], color='gray', label='Current', kde=True, alpha=0.3)
        plt.title('Suggested vs Current Price Distribution')
        plt.legend()
        
        # Subplot 2: Feature Importance
        plt.subplot(1, 2, 2)
        importances = pipeline.named_steps['regressor'].feature_importances_
        features = X_test.columns
        sns.barplot(x=importances, y=features, palette='viridis')
        plt.title('Feature Importance (What drives the price?)')
        
        plt.tight_layout()
        plt.savefig('evaluation_report.png')
        print("✅ Evaluation report saved as evaluation_report.png")
        
    except Exception as e:
        print(f"❌ Error during evaluation: {e}")

if __name__ == "__main__":
    evaluate_model()
