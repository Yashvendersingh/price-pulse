from pricing import suggest_price

tests = [
    (5400, 4700, 0.16, "Low demand"),
    (5400, 4700, 0.43, "Mid demand"),
    (5400, 4700, 0.83, "High demand"),
    (5100, 4800, 0.15, "User example low"),
    (5100, 4800, 0.50, "User example mid"),
    (5100, 4800, 0.85, "User example high"),
]

for base, comp, demand, label in tests:
    r = suggest_price(base, comp, demand)
    print(f"{label}: base={base}, comp={comp}, demand={demand:.0%} -> price={r['final_price']}")