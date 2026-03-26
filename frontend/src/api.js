const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchPricePrediction(competitor_price, demand) {
  const params = new URLSearchParams({ competitor_price, demand });
  const res = await fetch(`${API_BASE_URL}/predict?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Prediction failed");
  }
  return res.json();
}