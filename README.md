# Professional Portfolio Website - Majid Iqbal

A high-performance, modern, and professional portfolio website. This version is optimized for speed and simplicity, with all content managed directly on the frontend and a robust Node.js/Express.js/MongoDB backend for handling the "Contact Us" form submissions.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20MongoDB-green)

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Configuration](#-database-configuration)
- [Running Locally](#-running-locally)
- [API Documentation](#-api-documentation)

## 🌟 Project Overview
This portfolio is built to be extremely lightweight and fast. By moving static content (projects, skills, testimonials) into a dedicated frontend data file, we eliminate unnecessary API calls and database complexity while keeping the site fully functional and professional.

### Core Sections
1.  **Home**: Modern hero section with professional initials.
2.  **About**: Comprehensive summary and key experience metrics.
3.  **Skills**: Categorized skills (UI/UX, Frontend, Backend, etc.).
4.  **Services**: Overview of professional offerings.
5.  **Portfolio**: Smooth project grid with detailed modal views.
6.  **Testimonials**: Client feedback with star ratings.
7.  **Contact**: Fully functional AJAX contact form with MongoDB storage.

## 🚀 Key Features
- **Frontend Data Management**: Content is managed in `frontend/js/data.js` for instant loading and easy updates.
- **Secure Backend**: Node.js/Express.js server with comprehensive security middleware.
- **MongoDB Integration**: Scalable NoSQL storage for contact messages.
- **Input Validation**: Both client-side and server-side validation.
- **Rate Limiting**: Protection against spam and abuse.
- **Responsive & Premium UI**: Hand-crafted CSS with smooth animations and transitions.
- **Performance Optimized**: Zero dependency frontend (Vanilla JS) for maximum speed.

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3 (Vanilla, Glassmorphic Design)
- JavaScript (ES6+)
- Font Awesome 6

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- express-validator (Input validation)
- Helmet (Security headers)
- CORS (Cross-origin handling)
- Rate Limiting (Spam protection)
- express-mongo-sanitize (NoSQL injection prevention)

## 📂 Project Structure
```text
Portfolio-Website/
├── frontend/                    # Website files
│   ├── assets/                  # Images & media
│   ├── css/                     # Stylesheets
│   │   └── style.css            # Main styles
│   ├── js/                      # Logic & Data
│   │   ├── data.js              # STATIC CONTENT (Edit this)
│   │   └── main.js              # App logic
│   └── index.html               # Main page
│
├── backend/                     # Server-side logic
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   └── contactController.js # Contact form logic
│   ├── models/
│   │   └── Contact.js           # Mongoose schema
│   ├── routes/
│   │   └── contactRoutes.js     # API endpoints
│   ├── .env                     # Environment variables
│   ├── .env.example             # Example env file
│   ├── package.json             # Dependencies
│   ├── README.md                # Backend docs
│   └── server.js                # Entry point
│
└── README.md                    # This file
```

## 📦 Prerequisites
- **Node.js** (v14+)
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm** or **yarn**

## 📥 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Personal-Portfolio-Website
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment
Create/edit the `.env` file in the backend directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/portfolio_contacts

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## 🗄 Database Configuration

### Option 1: Local MongoDB
1. Install MongoDB on your machine
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Database will be created automatically on first contact submission

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio_contacts?retryWrites=true&w=majority
   ```

## 🏃 Running Locally

### 1. Start MongoDB (if using local)
```bash
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```
*Server runs on `http://localhost:5000`*

### 3. Open Frontend
Simply open `frontend/index.html` in your browser, or serve it using a local server:
```bash
# Using Live Server VS Code extension
# OR using npx
npx serve frontend
```

## 📡 API Documentation

### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | Get all submissions | Admin |
| GET | `/api/contact/:id` | Get single submission | Admin |
| PUT | `/api/contact/:id/status` | Update status | Admin |
| DELETE | `/api/contact/:id` | Delete submission | Admin |
| GET | `/api/contact/stats` | Get statistics | Admin |
| GET | `/api/health` | Health check | Public |

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential project collaboration."
  }'
```

### Response
```json
{
  "success": true,
  "message": "Your message has been sent successfully! I will get back to you soon.",
  "data": {
    "id": "65c1234abcd5678efgh90123",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "submittedAt": "2026-02-04T12:00:00.000Z"
  }
}
```

## 🔒 Security Features
- **Helmet**: Secure HTTP headers
- **CORS**: Origin-based access control
- **Rate Limiting**: 5 contact submissions per hour per IP
- **Input Validation**: Comprehensive server-side validation
- **NoSQL Injection Prevention**: Query sanitization
- **XSS Protection**: Input sanitization

## 📝 Contact Message Status
- `unread` - New submission (default)
- `read` - Viewed by admin
- `replied` - Response sent to client
- `archived` - Completed/archived

---
© 2026 Majid Iqbal. Professional, Clean, and Production-Ready.
