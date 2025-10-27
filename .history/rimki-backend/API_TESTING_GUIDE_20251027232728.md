# RIMKI Backend API Testing Guide

This guide will help you test all the API endpoints in the RIMKI backend.

## Prerequisites

1. Start the backend server:

   ```bash
   cd rimki-backend
   npm install
   npm run dev
   ```

2. The server will run on: `http://localhost:8080`

## Testing Methods

### Method 1: Using cURL (Terminal)

### Method 2: Using Postman (Recommended)

### Method 3: Using HTTPie

### Method 4: Using Browser (for GET requests only)

---

## API Endpoints Overview

### 1. Health Check

- **URL**: `GET /api/health`
- **Auth**: Not required
- **Description**: Check if the API is running

### 2. Authentication

- **URL**: `POST /api/auth/login`
- **Auth**: Not required
- **Description**: User login, returns JWT token
- **URL**: `GET /api/auth/profile`
- **Auth**: Required (Bearer token)
- **Description**: Get user profile

### 3. Chat

- **URL**: `POST /api/chat/message`
- **Auth**: Required (Bearer token)
- **Description**: Send message to chatbot

### 4. Quiz

- **URL**: `POST /api/quiz/upload`
- **Auth**: Required (Bearer token)
- **Description**: Upload document for quiz
- **URL**: `POST /api/quiz/create`
- **Auth**: Required (Bearer token)
- **Description**: Create a quiz
- **URL**: `GET /api/quiz/list`
- **Auth**: Required (Bearer token)
- **Description**: Get all quizzes

---

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

---

## Testing with cURL

### 1. Health Check

```bash
curl http://localhost:8080/api/health
```

**Expected Response**:

```json
{
  "status": "OK",
  "message": "RIMKI Backend API is running"
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response**:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@rimki.com"
  }
}
```

**⚠️ IMPORTANT**: Copy the `token` from this response for subsequent requests!

### 3. Get Profile (with authentication)

Replace `YOUR_TOKEN` with the token from step 2:

```bash
curl http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Send Chat Message

```bash
curl -X POST http://localhost:8080/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the company security policy?"}'
```

### 5. Create Quiz

```bash
curl -X POST http://localhost:8080/api/quiz/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security Policy Quiz",
    "questions": [
      {"question": "What is password policy?", "type": "multiple-choice"}
    ]
  }'
```

### 6. Get All Quizzes

```bash
curl http://localhost:8080/api/quiz/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Upload Document

```bash
curl -X POST http://localhost:8080/api/quiz/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@/path/to/your/file.pdf"
```

---

## Testing with Postman

### Import the Collection

1. Open Postman
2. Click **Import** button
3. Select `rimki-backend-api.postman_collection.json`
4. Or paste the JSON content directly

### Environment Setup

Create a Postman Environment with these variables:

- `base_url`: `http://localhost:8080`
- `token`: (will be set automatically after login)

### Collection Structure

The collection includes:

1. **Setup**: Get Health Check
2. **Auth**: Login → Get Profile
3. **Chat**: Send Message
4. **Quiz**: Upload Document → Create Quiz → List Quizzes

### Automatic Token Management

The collection uses Postman's automatic token extraction:

- After login, the token is saved to the `token` environment variable
- All protected routes automatically use this token
- No manual copying needed!

---

## Testing with HTTPie

### 1. Health Check

```bash
http GET localhost:8080/api/health
```

### 2. Login

```bash
http POST localhost:8080/api/auth/login username=admin password=admin123
```

### 3. Get Profile

```bash
http GET localhost:8080/api/auth/profile "Authorization:Bearer YOUR_TOKEN"
```

### 4. Send Chat Message

```bash
http POST localhost:8080/api/chat/message \
  "Authorization:Bearer YOUR_TOKEN" \
  message="What is the security policy?"
```

---

## Testing with Browser

Only for GET requests without authentication:

1. **Health Check**: Open `http://localhost:8080/api/health` in your browser

For authenticated or POST requests, use Postman or cURL.

---

## Testing Workflow

### Recommended Testing Order:

1. ✅ **Health Check** → Verify API is running
2. ✅ **Login** → Get authentication token
3. ✅ **Get Profile** → Test protected route with token
4. ✅ **Send Chat Message** → Test chatbot functionality
5. ✅ **Upload Document** → Test file upload
6. ✅ **Create Quiz** → Test quiz creation
7. ✅ **List Quizzes** → Retrieve all quizzes

---

## Common Issues & Solutions

### Issue 1: "Invalid token" or "Unauthorized"

- **Solution**: Make sure you're including the `Authorization: Bearer YOUR_TOKEN` header
- **Solution**: Check if the token hasn't expired (tokens last 24 hours)

### Issue 2: "Cannot connect to server"

- **Solution**: Make sure the backend server is running (`npm run dev`)
- **Solution**: Check if the port 8080 is available

### Issue 3: "Username and password are required"

- **Solution**: Make sure your request body has `Content-Type: application/json` header
- **Solution**: Verify the JSON format is correct

### Issue 4: "No file uploaded"

- **Solution**: Make sure you're using `multipart/form-data` for file uploads
- **Solution**: Check the field name is `document`

---

## Sample Test Scripts

### PowerShell Test Script

Save as `test-api.ps1`:

```powershell
$baseUrl = "http://localhost:8080"

# Health Check
Write-Host "Testing Health Check..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get

# Login
Write-Host "Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "Token: $token" -ForegroundColor Green

# Get Profile
Write-Host "Testing Get Profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method Get -Headers $headers

Write-Host "All tests completed!" -ForegroundColor Green
```

Run with: `.\test-api.ps1`

---

## Next Steps

1. ✅ Run all test scenarios
2. ✅ Verify all responses are as expected
3. ✅ Test error handling (invalid credentials, missing fields, etc.)
4. ✅ Test file uploads with different file types
5. ✅ Integrate with frontend application

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Postman Learning Center](https://learning.postman.com/)
- [JWT.io](https://jwt.io/) - Debug JWT tokens
