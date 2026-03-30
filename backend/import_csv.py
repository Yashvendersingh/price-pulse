import pandas as pd
from db import get_db_connection


conn = get_db_connection()
cursor = conn.cursor()

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

products_df = pd.read_csv("products.csv")

id_mapping = {}

for _, row in products_df.iterrows():
    cursor.execute(
        """INSERT INTO products (product_name, base_price, demand, stock) 
           VALUES (%s, %s, %s, %s) RETURNING product_id""",
        (row["product_name"], row["base_price"], row["demand"], row["stock"])
    )
    new_db_id = cursor.fetchone()["product_id"]
    

    csv_id = int(row["product_id"])
    id_mapping[csv_id] = new_db_id

conn.commit()
print(f"✅ {len(products_df)} Products inserted and mapped.")
competitors_df = pd.read_csv("competitors.csv")
count = 0

for _, row in competitors_df.iterrows():
    csv_product_id = int(row["product_id"])
    
    if csv_product_id in id_mapping:
        actual_product_id = id_mapping[csv_product_id]

        cursor.execute(
            """INSERT INTO competitors (product_id, competitor_name, price, rating, availability) 
               VALUES (%s, %s, %s, %s, %s)""",
            (actual_product_id, row["competitor_name"], row["price"], row["rating"], row["availability"])
        )
        count += 1
    else:
        print(f"⚠️ Warning: product_id {csv_product_id} from competitors.csv NOT found in products.csv")

conn.commit()
print(f"✅ {count} Competitors linked and inserted successfully.")

cursor.close()
conn.close()

print("🎉 All data imported to Neon with explicit ID mapping!")