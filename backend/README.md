# Portfolio Backend API

A secure and robust Node.js backend API for the Personal Portfolio Website contact form functionality.

## 🚀 Features

- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Validation** - Comprehensive input validation with express-validator
- **Security** - Helmet, CORS, Rate Limiting, NoSQL Injection Prevention
- **Error Handling** - Centralized error handling with detailed responses

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── contactController.js  # Contact form logic
├── models/
│   └── Contact.js            # Contact schema/model
├── routes/
│   └── contactRoutes.js      # API route definitions
├── .env                      # Environment variables (not in git)
├── .env.example              # Example environment file
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── server.js                 # Main application entry point
```

## 🛠️ Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio_contacts
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Contact Form

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | Get all submissions | Admin |
| GET | `/api/contact/:id` | Get single submission | Admin |
| PUT | `/api/contact/:id/status` | Update status | Admin |
| DELETE | `/api/contact/:id` | Delete submission | Admin |
| GET | `/api/contact/stats` | Get statistics | Admin |
| GET | `/api/health` | Health check | Public |

### Example Request

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential project."
  }'
```

### Example Response

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

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configured for specific origins only
- **Rate Limiting** - Prevents abuse (5 contact submissions/hour per IP)
- **Input Validation** - Validates all form inputs
- **NoSQL Injection Prevention** - Sanitizes queries
- **Body Size Limit** - Prevents large payload attacks

## 📊 Contact Status Flow

| Status | Description |
|--------|-------------|
| `unread` | New submission (default) |
| `read` | Viewed by admin |
| `replied` | Response sent |
| `archived` | Completed/archived |

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test contact form submission
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","subject":"Test Subject","message":"This is a test message."}'
```

## 🌐 Connecting to MongoDB Atlas

For production, update your `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio_contacts?retryWrites=true&w=majority
```

## 📝 License

MIT License - Majid Iqbal
