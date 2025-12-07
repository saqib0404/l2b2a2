# 🚗 Vehicle Rental Management System API

A full-featured **role-based Vehicle Rental Management System** built with **Node.js, Express, TypeScript, and PostgreSQL**.  
This API allows users to register, log in, book vehicles, and manage rentals with proper business rules and security.

---

Base API URL: https://l2b6a2-omega.vercel.app/   

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with password hashing (**bcrypt**)
- Secure login with **JWT authentication**
- Role-based access control:
  - **Admin**
  - **Customer**

### 👤 User Management
- View all users (**Admin only**)
- Update user profile (self or admin)
- Delete user (**blocked if user has active bookings**)

### 🚘 Vehicle Management
- Create vehicles (**Admin only**)
- Update vehicles (**Admin only**)
- Delete vehicles (**blocked if vehicle has active bookings**)
- Track vehicle availability (`available`, `booked`)

### 📅 Booking System
- Create bookings with start & end dates
- Automatic price calculation:
- Role-based booking visibility:
- **Admin:** View all bookings
- **Customer:** View own bookings only
- Booking status updates:
- `active`
- `cancelled` (customer only, before start date)
- `returned` (admin only)

### 🔄 Automated Business Logic
- **Auto-return system:**  
Bookings are automatically marked as `returned` when the `rent_end_date` passes.
- Vehicle availability is automatically updated to `available`.
- Safe deletion rules enforced at service level.

---

## 🛠️ Technology Stack

| Layer | Technology |
|------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Scheduler | node-cron |
| API Testing | Postman |

---

## ⚙️ Setup & Usage Instructions

```bash
git clone <your-repo-url>
cd l2b6a2
npm install
Create a .env file in the root directory:

PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental_db
JWT_SECRET=yourSuperSecretKey

npm run dev

