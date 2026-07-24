# 🛍️ TripSaver — Real-Time Local Store Inventory Platform

> A full-stack project currently under development that helps customers check real-time product availability in nearby retail stores before visiting — reducing wasted trips while giving retailers simple, powerful inventory management tools.

**Status:** 🚧 Under Active Development (20–25% complete)

---

## 💡 The Problem

This project was inspired by two real-world problems faced by small local businesses:

### Problem A — Wasted Ad Spend
Small brands lose advertising budget because they lack the expertise and time to continuously optimize campaigns. Promoting out-of-stock products makes this even worse — wasted clicks, frustrated customers.

### Problem B — Wasted Store Trips
Customers travel to nearby stores expecting to buy a product, only to find it's out of stock. Without real-time inventory visibility, these trips waste time and erode trust in local retailers.

---

## ✅ The Solution

**TripSaver** bridges the gap between customers and local retailers through live inventory visibility.

- **Shoppers** can search for products, check stock status at nearby stores, reserve items, and get restock alerts — before leaving home.
- **Store owners** can manage their inventory through a simple dashboard, keeping stock data accurate and up to date.

By making inventory visible before a visit, TripSaver helps businesses improve customer satisfaction, reduce wasted trips, and make local advertising more effective.

---

## ✨ Features

### 👤 For Shoppers
- 🔍 Search products by name or category
- 📍 View nearby stores carrying the item
- 📊 Real-time stock status
  - ✅ In Stock
  - 🟡 Low Stock
  - ❌ Out of Stock
- 🔒 Reserve products before visiting
- 🔔 Restock notifications *(planned)*

### 🏪 For Store Owners
- 📋 Inventory management dashboard
- ➕ Add, edit, and remove products
- 🖼️ Product image uploads via Cloudinary
- 🔄 Manual inventory updates
- 🚫 Out-of-stock visibility control
- 📷 Barcode scanning support *(planned)*
- 🔗 Auto inventory deduction via POS integration *(planned)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, CSS |
| Backend | Flask, Python, REST API |
| Database | PostgreSQL |
| Image Storage | Cloudinary |

---

## 📁 Project Structure

```
TripSaver/
│
├── frontend/         # React + TypeScript app
├── backend/          # Flask REST API
├── database/         # PostgreSQL schema & migrations
└── README.md
```

---

## 🚦 Development Progress

### ✅ Completed
- Authentication — Login & Registration (Shopper + Store Owner)
- Store owner dashboard — Add, Edit, Delete, View products
- Product image upload via Cloudinary
- Out-of-stock visibility toggle
- Home page with product listings
- PostgreSQL database integration
- Flask REST API structure

### 🔄 In Progress
- Product search
- Nearby store results
- Reservation system

### 📅 Planned
- Restock notifications
- Barcode scanner
- Google Maps integration
- Automatic inventory updates via POS
- Analytics dashboard
- Ad spend optimization (Mode 2)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js
- Python 3.x
- PostgreSQL

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

> ⚠️ Create a `.env` file in `/backend` with your PostgreSQL credentials and Cloudinary API keys before running. Never commit `.env` to GitHub.

---

## 🙋 About This Project

This is a personal side project I'm building while working as a Software Engineer Trainee. The goal is to solve two real, everyday problems for small local retailers — and to grow as a full-stack developer in the process.

I'm sharing the journey publicly — follow along on [LinkedIn](#) for weekly updates.

---

## 📄 License

This project is for learning and personal development purposes.
