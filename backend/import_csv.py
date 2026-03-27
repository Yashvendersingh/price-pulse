import pandas as pd
from db import conn, cursor

# 🟢 insert products
products = pd.read_csv("products.csv")

product_ids = []

for _, row in products.iterrows():
    cursor.execute(
        "INSERT INTO products (product_name, base_price, demand, stock) VALUES (%s, %s, %s, %s)",
        (row["product_name"], row["base_price"], row["demand"], row["stock"])
    )
    product_ids.append(cursor.lastrowid)

conn.commit()
print("✅ Products inserted")

# 🟢 insert competitors
competitors = pd.read_csv("competitors.csv")

for _, row in competitors.iterrows():
    actual_product_id = product_ids[int(row["product_id"]) - 1]

    cursor.execute(
        "INSERT INTO competitors (product_id, competitor_name, price, rating, availability) VALUES (%s, %s, %s, %s, %s)",
        (actual_product_id, row["competitor_name"], row["price"], row["rating"], row["availability"])
    )

conn.commit()
print("✅ Competitors inserted")