# 🛕 KiruThirupathi Temple Management System

A full-fledged, production-grade **Temple Management Website** developed using the **PERN Stack** (PostgreSQL, Express.js, React.js, Node.js). The platform serves thousands of users with features like online donations, automated receipts, secure transactions via Razorpay, and WhatsApp-based authentication.

🌐 **Live Website**: [https://kiruthirupathi.org](https://kiruthirupathi.org)

---

## 🚀 Features

- 🔐 **User Registration & Authentication**  
  Secure user signup/login with WhatsApp OTP integration using Brevo API.

- 💳 **Online Donation System**  
  Seamless payment experience powered by **Razorpay**, with over 500+ transactions and 98% success rate.

- 📜 **Receipt Generation & Audit Logging**  
  Automatic PDF receipt generation and backend audit logs for every transaction.

- 📱 **Microservice Architecture**  
  15+ microservices optimised for scalability and modular development. Achieved **40% improvement in API response times**.

- 🛎️ **Real-Time Notifications**  
  Users receive updates and confirmations via WhatsApp, improving engagement and reducing support queries.

---

## 🧰 Tech Stack

| Layer         | Technology                     |
|---------------|--------------------------------|
| Frontend      | React.js, MUI       |
| Backend       | Node.js, Express.js            |
| Database      | PostgreSQL                     |
| Payment       | Razorpay API                   |
| Notifications | Brevo WhatsApp API            |
| Deployment    | AWS |

---

## 📦 Microservices Overview

Some of the key microservices:

- `user-auth-service` – WhatsApp OTP login, session management  
- `donation-service` – Handles payments, confirmations  
- `receipt-service` – Generates and sends downloadable PDFs  
- `audit-log-service` – Securely logs sensitive events  
- `notification-service` – Pushes updates via WhatsApp  



