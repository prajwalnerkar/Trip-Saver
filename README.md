# Real-Time Local Store Inventory Platform

A personal full-stack project currently under development that helps customers check real-time product availability in nearby retail stores before visiting. The platform aims to reduce unnecessary store visits while providing retailers with simple inventory management tools.

> **Status:** 🚧 Under Development

---

## About the Project

This project is inspired by the **"Two Problems, One Solution"** problem statement.

### Problem A
**How can small brands optimize digital ads within limited budgets?**

Small businesses often spend their advertising budget inefficiently because they lack the expertise and time to continuously optimize campaigns. Advertising products that are unavailable in stores can also lead to wasted ad spend and poor customer experience.

### Problem B
**Why do shoppers visit stores only to find items unavailable?**

Customers frequently travel to nearby stores expecting to buy a product, only to discover it is out of stock. Without access to real-time inventory information, these trips waste both time and effort.

---

## Solution

The **Real-Time Local Store Inventory Platform** bridges the gap between customers and local retailers by providing live inventory visibility.

Customers can search for products, check stock availability in nearby stores, reserve items, and receive restock notifications. Store owners can easily update inventory through a simple dashboard, ensuring inventory information remains accurate and up to date.

By making inventory visible before customers visit a store, businesses can improve customer satisfaction while reducing wasted trips and potentially improving the effectiveness of local advertising.

---

## Features

### Customer

- Search for products
- View nearby stores
- Real-time stock status
  - ✅ In Stock
  - 🟡 Low Stock
  - ❌ Out of Stock
- Reserve products
- Receive restock notifications

### Store Owner

- Inventory dashboard
- Add, update and remove products
- Manual inventory updates
- Barcode scanning support *(planned)*
- Automatic inventory deduction after sales *(planned)*

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS

### Backend

- Flask
- Python
- REST API

### Database

- PostgreSQL

---

## Project Structure

```
project-root/
│
├── frontend/
├── backend/
├── database/
└── README.md
```

---

## Current Development

### Completed

- Project setup
- React frontend
- Flask backend
- PostgreSQL integration
- Basic API structure

### In Progress

- Product search
- Store inventory management
- Store dashboard
- Reservation system

### Planned

- Restock notifications
- Barcode scanner
- Authentication
- Google Maps integration
- Automatic inventory updates
- Analytics dashboard

---

## Installation

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

pip install -r requirements.txt

python app.py
```

---

## License

This project is for learning and personal development purposes.
