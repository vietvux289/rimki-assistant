# RIMKI Assistant Backend API

Backend API for RIMKI Assistant - A security policy assistant application.

## Features

- 🔐 Authentication (JWT-based)
- 💬 AI Chatbot API
- 📝 Quiz Builder
- 📤 File Upload (documents)
- 🔒 Protected Routes

## Tech Stack

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (already created, update if needed):
```env
PORT=8080
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Chat
- `POST /api/chat/message` - Send chat message (requires auth)

### Quiz
- `POST /api/quiz/upload` - Upload document (requires auth)
- `POST /api/quiz/create` - Create quiz (requires auth)
- `GET /api/quiz/list` - Get all quizzes (requires auth)

### Health Check
- `GET /api/health` - Check API status

## Default Credentials

- Username: `admin`
- Password: `admin123`

## Project Structure

```
src/
├── config/          # Configuration files (database, multer)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth)
├── routes/          # API routes
├── uploads/         # Uploaded files
└── index.ts         # Main server file
```

## Development

- Development mode: `npm run dev`
- Production build: `npm run build`
- Production start: `npm start`

## Notes

- Currently uses in-memory database (data resets on server restart)
- For production, integrate with MongoDB/PostgreSQL
- Chat responses are simulated (integrate with AI service for real responses)
- File uploads are stored in `src/uploads/`
