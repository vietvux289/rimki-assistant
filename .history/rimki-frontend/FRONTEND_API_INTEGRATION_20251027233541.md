# Frontend API Integration Guide

This document explains how the frontend has been integrated with the backend API.

## 📁 File Structure

### New Service Files Created:

```
src/services/
├── authService.ts       # Authentication services (login, logout, profile)
├── chatService.ts       # Chat message services
├── quizService.ts       # Quiz services (upload, create, list)
└── axios.customize.ts   # Updated with API integration
```

### Updated Components:

- `src/pages/Login.tsx` - Now connects to `/api/auth/login`
- `src/components/ChatBox.tsx` - Sends messages to `/api/chat/message`
- `src/components/SecureQuizBuilder.tsx` - Handles document upload and quiz creation
- `src/layouts/Header.tsx` - Shows user info and logout functionality

### New Components:

- `src/components/ProtectedRoute.tsx` - Protects routes requiring authentication

---

## 🔑 Authentication Flow

### 1. Login Process

```typescript
// User enters credentials
const onFinish = async (values: any) => {
  await authService.login(values.username, values.password);
  // Token is automatically stored in localStorage
  navigate("/home");
};
```

**Backend Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@rimki.com"
  }
}
```

### 2. Token Management

- Token is stored in `localStorage` as `access_token`
- User info is stored in `localStorage` as `user`
- Token is automatically added to all API requests via axios interceptor
- Token expires after 24 hours (handled by backend)

### 3. Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
<Route path="/home" element={
  <ProtectedRoute>
    <Home />
  </ProtectedRoute>
} />
```

If user is not authenticated, they are redirected to `/login`.

---

## 💬 Chat Integration

### Sending Messages

```typescript
import { chatService } from "../services/chatService";

const handleSend = async () => {
  const response = await chatService.sendMessage(userInput);
  // Display bot response
};
```

**Backend Endpoint:** `POST /api/chat/message`

**Request:**
```json
{
  "message": "What is the company security policy?"
}
```

**Response:**
```json
{
  "message": "Based on the uploaded documents...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Authentication Required
- Chat requires authentication
- JWT token is automatically sent with the request

---

## 📝 Quiz Integration

### 1. Uploading Documents

```typescript
import { quizService } from "../services/quizService";

const handleUpload = async () => {
  const response = await quizService.uploadDocument(file);
  message.success("Uploaded successfully!");
};
```

**Backend Endpoint:** `POST /api/quiz/upload`

**Request:** FormData with `document` field

**Response:**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "1234567890",
    "filename": "security-policy.pdf",
    "size": 12345,
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Creating Quizzes

```typescript
const handleCreateQuiz = async () => {
  const response = await quizService.createQuiz("Security Policy Quiz");
  setQuizLink(response.quiz.link);
};
```

**Backend Endpoint:** `POST /api/quiz/create`

**Request:**
```json
{
  "title": "Security Policy Quiz",
  "questions": [...]
}
```

**Response:**
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "id": "1234567890",
    "title": "Security Policy Quiz",
    "link": "https://rimki-quiz.com/quiz/1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Listing Quizzes

```typescript
const getQuizzes = async () => {
  const response = await quizService.getQuizzes();
  // Display quizzes
};
```

**Backend Endpoint:** `GET /api/quiz/list`

**Response:**
```json
{
  "quizzes": [
    {
      "id": "1234567890",
      "title": "Security Policy Quiz",
      "link": "https://rimki-quiz.com/quiz/1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## ⚙️ Axios Configuration

### Base Configuration

Located in `src/services/axios.customize.ts`:

```typescript
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true
});
```

### Request Interceptor

Automatically adds JWT token to all requests:

```typescript
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    return config;
  }
);
```

### Response Interceptor

Handles authentication errors:

```typescript
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🎯 How to Use

### 1. Start the Backend

```bash
cd rimki-backend
npm run dev
```

Server runs on `http://localhost:8080`

### 2. Start the Frontend

```bash
cd rimki-frontend
npm run dev
```

Frontend runs on `http://localhost:5173` (default Vite port)

### 3. Testing Flow

1. **Login**: Go to `/login` and enter credentials
   - Username: `admin`
   - Password: `admin123`

2. **Chat**: After login, you can send messages to the chatbot
   - Messages are sent to `/api/chat/message`
   - Responses are displayed in real-time

3. **Upload Documents**: 
   - Click "Add documents" in SecureQuiz Builder
   - Select a file
   - Click "Upload" button
   - Document is sent to `/api/quiz/upload`

4. **Create Quiz**:
   - Click "Create Quiz" button
   - Quiz is created via `/api/quiz/create`
   - Quiz link is displayed

5. **Logout**: Click the logout button in the header
   - Token and user info are removed
   - User is redirected to login page

---

## 🐛 Troubleshooting

### Issue: "Failed to login"

**Solutions:**
- Make sure the backend server is running on port 8080
- Check that the backend accepts CORS requests from your frontend
- Verify credentials are correct: `admin` / `admin123`

### Issue: "Unauthorized" or "401 Error"

**Solutions:**
- Token may have expired (valid for 24 hours)
- Logout and login again
- Check if token is stored in localStorage

### Issue: "Cannot connect to backend"

**Solutions:**
- Verify backend is running: `npm run dev` in rimki-backend
- Check the baseURL in `axios.customize.ts`
- Make sure no firewall is blocking the connection

### Issue: "CORS error"

**Solutions:**
- Backend should already be configured with CORS
- Check `rimki-backend/src/index.ts` for `app.use(cors())`

---

## 📝 Environment Configuration

Create a `.env` file in `rimki-frontend/` if needed:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Or update `axios.customize.ts` directly with the backend URL.

---

## 🔐 Security Notes

1. **Tokens**: JWT tokens are stored in localStorage (consider httpOnly cookies for production)

2. **API Endpoints**: All protected endpoints require authentication

3. **Token Expiration**: Tokens expire after 24 hours (configured in backend)

4. **CORS**: Backend accepts requests from any origin (configure properly for production)

---

## 🚀 Next Steps

1. **Implement Error Boundaries** for better error handling
2. **Add Loading States** for better user experience
3. **Implement Real-time Updates** using WebSockets if needed
4. **Add Form Validation** for better data integrity
5. **Implement File Preview** before upload
6. **Add Quiz Questions Editor** with rich text support

---

## 📚 API Endpoints Summary

| Method | Endpoint | Auth Required | Used In |
|--------|----------|---------------|---------|
| POST | `/api/auth/login` | ❌ | Login page |
| GET | `/api/auth/profile` | ✅ | Profile (future) |
| POST | `/api/chat/message` | ✅ | ChatBox component |
| POST | `/api/quiz/upload` | ✅ | SecureQuizBuilder |
| POST | `/api/quiz/create` | ✅ | SecureQuizBuilder |
| GET | `/api/quiz/list` | ✅ | Quiz list (future) |

---

For more information, see:
- [Backend API Testing Guide](../rimki-backend/API_TESTING_GUIDE.md)
- [Quick Start Testing Guide](../rimki-backend/QUICK_START_TESTING.md)

