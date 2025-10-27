# Quick Start: Testing the RIMKI Backend API

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server

```bash
cd rimki-backend
npm install
npm run dev
```

The server will start on `http://localhost:8080`

### Step 2: Create .env File

Create a `.env` file in the `rimki-backend` folder:

```env
PORT=8080
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Step 3: Test the API

Choose one of these methods:

---

## 📦 Method 1: Using Postman (Recommended)

1. Import the collection: `rimki-backend-api.postman_collection.json`
2. Create environment with variable:
   - `base_url`: `http://localhost:8080`
3. Start the tests from the collection
4. Token is automatically saved after login!

---

## 🖥️ Method 2: Using PowerShell Script

```powershell
cd rimki-backend
.\test-api.ps1
```

This will test all endpoints automatically!

---

## 💻 Method 3: Using cURL (Manual Testing)

### Quick Health Check

```bash
curl http://localhost:8080/api/health
```

### Login and Get Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Test Protected Endpoint (replace YOUR_TOKEN)

```bash
curl http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Method 4: Using Postman Raw HTTP

Open Postman and paste these requests:

### Health Check

```
GET http://localhost:8080/api/health
```

### Login

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Get Profile (replace YOUR_TOKEN)

```
GET http://localhost:8080/api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

---

## 🔑 Default Credentials

- Username: `admin`
- Password: `admin123`

---

## 📚 Available Endpoints

| Method | Endpoint            | Auth Required | Description       |
| ------ | ------------------- | ------------- | ----------------- |
| GET    | `/api/health`       | ❌            | Health check      |
| POST   | `/api/auth/login`   | ❌            | User login        |
| GET    | `/api/auth/profile` | ✅            | Get user profile  |
| POST   | `/api/chat/message` | ✅            | Send chat message |
| POST   | `/api/quiz/upload`  | ✅            | Upload document   |
| POST   | `/api/quiz/create`  | ✅            | Create quiz       |
| GET    | `/api/quiz/list`    | ✅            | List all quizzes  |

---

## ⚡ Test All Endpoints (Quick Command)

```bash
# Windows (PowerShell)
.\test-api.ps1

# Mac/Linux
chmod +x test-api.sh
./test-api.sh
```

---

## 🐛 Troubleshooting

### Server not starting?

- Make sure port 8080 is not in use
- Check if Node.js is installed: `node --version`

### Getting 401 Unauthorized?

- Make sure you're including the `Authorization: Bearer TOKEN` header
- Login again to get a fresh token

### Can't connect?

- Verify the server is running: `npm run dev`
- Check the URL: `http://localhost:8080`

---

## 📖 Full Documentation

For detailed testing instructions, see: `API_TESTING_GUIDE.md`
