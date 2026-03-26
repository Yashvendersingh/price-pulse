import React from "react";

export default function ProductTable({ products }) {
  return (
    <div className="card">
      <h3>Product Dashboard Table</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Base</th><th>Current</th>
            <th>Demand</th><th>Stock</th><th>Comp avg</th><th>Suggested</th><th>% diff</th><th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.product_name}</td>
              <td>{p.category}</td>
              <td>{p.base_price.toFixed(2)}</td>
              <td>{p.current_price.toFixed(2)}</td>
              <td>{p.demand}</td>
              <td>{p.stock_quantity}</td>
              <td>{p.competitor_avg_price.toFixed(2)}</td>
              <td>{p.suggested_price.toFixed(2)}</td>
              <td>{p.price_difference.toFixed(1)}%</td>
              <td>{p.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}