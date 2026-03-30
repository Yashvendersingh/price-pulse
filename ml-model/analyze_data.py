import pandas as pd
df = pd.read_csv('model/realistic_pricing_dataset.csv').dropna()
low = df[df['demand'] < 0.2]
mid = df[(df['demand'] > 0.4) & (df['demand'] < 0.6)]
high = df[df['demand'] > 0.8]

print("Target/Comp ratio by demand bucket:")
print(f"  Low demand (<20%):   avg ratio = {(low['target_price']/low['competitor_price']).mean():.4f}")
print(f"  Mid demand (40-60%): avg ratio = {(mid['target_price']/mid['competitor_price']).mean():.4f}")
print(f"  High demand (>80%):  avg ratio = {(high['target_price']/high['competitor_price']).mean():.4f}")

print(f"\nTarget/Base ratio by demand bucket:")
print(f"  Low demand (<20%):   avg ratio = {(low['target_price']/low['base_price']).mean():.4f}")
print(f"  Mid demand (40-60%): avg ratio = {(mid['target_price']/mid['base_price']).mean():.4f}")
print(f"  High demand (>80%):  avg ratio = {(high['target_price']/high['base_price']).mean():.4f}")

print(f"\nAvg discount_percent by demand:")
print(f"  Low demand:  {low['discount_percent'].mean():.2f}%")
print(f"  Mid demand:  {mid['discount_percent'].mean():.2f}%")
print(f"  High demand: {high['discount_percent'].mean():.2f}%")
