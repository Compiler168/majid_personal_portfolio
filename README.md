# Professional Personal Portfolio Website

A high-performance, responsive personal portfolio website designed for UI/UX Designers and Full-Stack Developers. Built with modern web technologies, this project features a stunning dark/light theme, dynamic content loading, animations, and a robust backend for handling contact form submissions with automated email notifications.

## 🚀 Key Features

*   **Responsive Design:** Pixel-perfect layout that adapts seamlessly to Mobile, Tablet, and Desktop screens.
*   **Dynamic Content:** All content (Skills, Projects, Testimonials) is managed via a central `data.js` file for easy updates.
*   **Modern Aesthetics:** Clean UI with smooth reveal animations, glassmorphism effects, and professional typography.
*   **Project Showcase:** Interactive portfolio grid with direct links to live projects.
*   **Contact Form with Email:** Fully functional backend that saves messages to MongoDB and sends **real-time email notifications** (Admin Alert + User Auto-Reply).
*   **Security:** Integrated with `helmet`, `xss-clean`, and `cors` for secure API handling.
*   **Dark Mode Support:** Intelligent styling that respects system preferences.

## 🛠️ Technology Stack

**Frontend:**
*   HTML5, CSS3 (Custom Properties & Animations)
*   JavaScript (ES6+)
*   Font Awesome (Icons)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database)
*   Nodemailer (Email Service)
*   Express Validator (Input Validation)

---

## ⚙️ Installation & Setup (Local Development)

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
*   Node.js installed (v14 or higher)
*   MongoDB Account (Atlas) or local MongoDB installed
*   Gmail Account (for email notifications)

### 2. Clone the Repository
```bash
git clone https://github.com/YourUsername/MyPersonalPortfolio.git
cd MyPersonalPortfolio
```

### 3. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

### 4. Environment Variables (.env)
Create a `.env` file in the `backend` folder and add the following credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://127.0.0.1:5500
# Email Configuration (Requires Gmail App Password)
EMAIL_USER=majidzaffar35@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **IMPORTANT:** To get `your_gmail_app_password`:
> 1. Go to your Google Account > Security.
> 2. Enable "2-Step Verification".
> 3. Search for "App Passwords".
> 4. Create a new app password (name it "Portfolio") and paste the 16-character code into `EMAIL_PASS`.

### 5. Run the Backend
```bash
npm run dev
# Server should start on port 5000
```

### 6. Run the Frontend
You can use `Live Server` in VS Code or simply open `frontend/index.html` in your browser.

---

## 🌐 Deployment Logic

### Backend (Vercel)
The backend is optimized for Vercel serverless deployment.
1.  Push code to GitHub.
2.  Import project to Vercel.
3.  Set **Root Directory** to `backend`.
4.  Add Environment Variables in Vercel Settings (`MONGODB_URI`, `EMAIL_USER`, `EMAIL_PASS`, etc.).
5.  Deploy.

### Frontend
1.  Host on Vercel, Netlify, or GitHub Pages.
2.  Update `frontend/js/data.js` or `main.js` to point to your deployed Backend API URL (e.g., `https://your-backend.vercel.app/api/contact`).

---

## 📬 Email Functionality Details

The backend uses **Nodemailer** to send two emails upon form submission:

1.  **Admin Notification:** Sent to `majidzaffar35@gmail.com`. Contains the sender's details and message payload.
2.  **User Auto-Reply:** Sent to the visitor. Contains a professional "Thank You" message confirming receipt.

**Note:** If `EMAIL_USER` or `EMAIL_PASS` are missing in the environment variables, the system will log a warning but still save the message to the database.

---

## 📁 Project Structure

```
.
├── backend/
│   ├── config/         # DB Connection
│   ├── controllers/    # Logic for Contact Form & Emails
│   ├── models/         # Mongoose Schema
│   ├── routes/         # API Routes
│   ├── index.js        # Entry Point
│   └── .env            # Env Vars (Not committed)
│
├── frontend/
│   ├── assets/         # Images & PDF
│   ├── css/            # Styles
│   ├── js/             # Data & Logic
│   └── index.html      # Main Page
│
└── README.md           # Documentation
```

## 🤝 Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
