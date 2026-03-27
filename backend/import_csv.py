import pandas as pd
from db import conn, cursor

# Create Schema
print("🔨 Creating tables...")
cursor.execute("""
    DROP TABLE IF EXISTS price_history CASCADE;
    DROP TABLE IF EXISTS competitors CASCADE;
    DROP TABLE IF EXISTS products CASCADE;

    CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        base_price NUMERIC NOT NULL,
        demand FLOAT NOT NULL,
        stock INT NOT NULL
    );

    CREATE TABLE competitors (
        id SERIAL PRIMARY KEY,
        product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
        competitor_name VARCHAR(100) NOT NULL,
        price NUMERIC NOT NULL,
        rating FLOAT,
        availability INT
    );

    CREATE TABLE price_history (
        id SERIAL PRIMARY KEY,
        product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
        price NUMERIC NOT NULL,
        timestamp TIMESTAMP NOT NULL
    );
""")
conn.commit()
print("✅ Tables created successfully.")

# 🟢 Insert Products
products = pd.read_csv("products.csv")
product_ids = []

for _, row in products.iterrows():
    # In PostgreSQL, we use RETURNING to get the generated ID
    cursor.execute(
        """INSERT INTO products (product_name, base_price, demand, stock) 
           VALUES (%s, %s, %s, %s) RETURNING product_id""",
        (row["product_name"], row["base_price"], row["demand"], row["stock"])
    )
    # the returned row is a dictionary since we use RealDictCursor in db.py
    new_id = cursor.fetchone()["product_id"]
    product_ids.append(new_id)

conn.commit()
print(f"✅ {len(product_ids)} Products inserted")

# 🟢 Insert Competitors
competitors = pd.read_csv("competitors.csv")
count = 0

for _, row in competitors.iterrows():
    # competitors.csv has product_id starting from 1. 
    # We map it to the actual product_id generated in Neon Postgres (just in case they aren't 1-to-1)
    actual_product_id = product_ids[int(row["product_id"]) - 1]

    cursor.execute(
        """INSERT INTO competitors (product_id, competitor_name, price, rating, availability) 
           VALUES (%s, %s, %s, %s, %s)""",
        (actual_product_id, row["competitor_name"], row["price"], row["rating"], row["availability"])
    )
    count += 1

conn.commit()
print(f"✅ {count} Competitors inserted")
print("🎉 All data imported to Neon successfully!")