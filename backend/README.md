🚀 Price Pulse - Backend (Flask + MySQL + ML)
📌 Overview

This backend system provides intelligent price recommendations based on:

Competitor pricing
Product demand
Machine Learning model

It exposes REST APIs that can be consumed by the frontend.

🛠 Tech Stack
Flask (Backend API)
MySQL (Database)
Scikit-learn (ML Model)
Joblib (Model Loading)
⚙️ Setup Instructions
1. Clone Repository
git clone <repo_link>
cd backend
2. Create Environment File

Create .env file using .env.example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=price_pulse
3. Install Dependencies
pip install -r requirements.txt
4. Run Backend
python app.py
🌐 Base URL
http://127.0.0.1:5000
🔗 API Endpoints
📦 Get All Products
GET /products
📊 Compare Product Price
GET /comparison/<product_id>
🤖 Get Price Recommendation (ML)
GET /recommendation/<product_id>
📈 Dashboard Data
GET /dashboard
📤 Response Format

All APIs return:

{
  "status": "success",
  "data": { ... }
}

Error format:

{
  "status": "error",
  "message": "Error message"
}
🧠 Features
Multiple competitor price handling
ML-based price prediction
Dynamic pricing logic
Price history tracking
Clean modular architecture
⚠️ Important Notes
Do NOT commit .env file
Make sure MySQL is running
Ensure database price_pulse exists
Backend must be running before frontend connects
🔄 How Frontend Will Use

Example:

fetch("http://127.0.0.1:5000/dashboard")
  .then(res => res.json())
  .then(data => console.log(data));
👨‍💻 Backend Structure
backend/
 ├── app.py
 ├── db.py
 ├── pricing.py
 ├── ml_model.py
 ├── requirements.txt
 ├── .env (not committed)
 ├── .env.example
🚀 Future Improvements
Real-time competitor scraping
Advanced ML model tuning
Deployment (AWS / Render / Docker)
Authentication system