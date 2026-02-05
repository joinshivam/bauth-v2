# BAuth Client – React Authentication Frontend

A modern client-side authentication frontend built with React (CRA), focused on clean routing, global auth state management, and real-world SPA authentication flows.

🚀 Live Demo: https://joinshivam-bauth.vercel.app  
📦 Repository: https://github.com/joinshivam/bauth-client

---

## 📌 Project Overview

BAuth Client is a **scratch-built React authentication frontend** that demonstrates how a real-world authentication system behaves on the client side.

The project focuses on:
- Public vs Protected routes
- Global user state handling using Auth Context
- Dynamic user-based routing
- SPA navigation using React Router DOM
- Session-aware UI behavior

This project is designed as a **client auth layer** that can integrate with any authentication API.

---

## 🔑 Key Features

- Public & Protected Route Separation
- Login & Signup Flow
- Global Authentication State (Context API)
- Dynamic Routes using Username
- User Dashboard & Profile Pages
- Theme Toggle (Dark / Light)
- Active Sessions & Login History View
- Logout from All Sessions (Security Feature)
- SPA Navigation (No Page Reloads)

---

## 🧠 Authentication Flow

### Public Routes (Accessible without login)
- `/` – Landing / Index Page
- `/login` – Existing user login
- `/signup` – New user registration

### After User Login
- Header UI switches to **logged-in mode**
- Login / Signup buttons disappear
- Public auth routes become inaccessible

### Protected Routes (User-specific)
After login, the user is redirected to:

- `/:username` – User Dashboard
- `/:username/profile` – Personal information
- `/:username/privacy` – Privacy settings
- `/:username/security` – Sessions & security
- `/:username/settings` – App preferences

All routes are dynamically controlled based on authentication state.

---

## 🛠 Tech Stack

### Frontend
- React (CRA)
- React Router DOM
- Context API (Global Auth State)
- JavaScript (ES6+)
- CSS / UI-based theming

### Architecture
- Single Page Application (SPA)
- Client-side route protection
- Centralized authentication context

### Deployment
- Vercel

---

## ⚙️ Installation & Setup

### Clone the repository
```bash
git clone https://github.com/joinshivam/bauth-client.git
cd bauth-client

npm install
npm start

The app will be available at:
http://localhost:3000

## Project Structure

src/
├── components/
├── pages/
├── context/
│   └── AuthContext.jsx
├── routes/
├── utils/
├── App.js
└── index.js

## Security & Session Handling

Authentication state is managed globally
UI access is strictly controlled via protected routes
User can view active sessions
“Logout from everywhere” option for suspicious activity
Public routes are blocked once user is authenticated

#Known Limitations

Client-side authentication only
No OAuth (Google / GitHub) support yet
No refresh token handling
API-level security depends on backend implementation
Not optimized for large-scale production use

## Future Improvements

OAuth login (Google / GitHub)
Refresh token & session expiry handling
Role-based access control
Better error handling & validations
Backend API integration examples

## Author
Shivam
GitHub: https://github.com/joinshivam
Project Repo: https://github.com/joinshivam/bauth-client

## Support
If you find this project useful or learned something from it,
please consider giving it a ⭐ on GitHub — it really helps!

