import joblib
import pandas as pd

pipeline = joblib.load('model.pkl')

tc = [
    {'label': 'User screenshot (50%)', 'comp': 43500, 'demand': 0.50, 'base': 45000},
    {'label': 'User screenshot (49%)', 'comp': 43500, 'demand': 0.49, 'base': 45000}
]

print('New predictions:')
for t in tc:
    df = pd.DataFrame([{
        'competitor_price': t['comp'], 
        'demand': t['demand'], 
        'stock': 50, 
        'is_holiday': 0, 
        'base_price': t['base'], 
        'comp_x_demand': t['comp'] * t['demand']
    }])
    pred = pipeline.predict(df)[0]
    print(f"{t['label']}: {pred}")
