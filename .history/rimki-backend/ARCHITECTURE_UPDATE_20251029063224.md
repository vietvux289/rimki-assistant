# RIMKI Backend API - Updated Architecture

## Overview
The backend has been updated to handle only login and quiz creation functionality. Chat functionality now calls external API at `10.1.24.54`.

## Key Changes

### Backend Changes
1. **Removed chat routes** - Backend only handles `/api/auth` and `/api/quiz` endpoints
2. **Updated quiz controller** to:
   - Fetch quiz data from external API (`http://10.1.24.54/api/quiz-data`)
   - Integrate with Google Forms API to create actual Google Forms
   - Support multiple languages (Vietnamese, Japanese, English)
3. **Added dependencies**: `axios` and `googleapis`

### Frontend Changes
1. **Updated API calls**:
   - Login calls local backend API (`localhost:8080`)
   - Chat and document upload call external API (`10.1.24.54`)
   - Quiz creation calls local backend API
2. **Added language selection** to quiz creation UI with radio buttons for:
   - Tiếng Việt (Vietnamese)
   - 日本語 (Japanese) 
   - English

## Setup Instructions

### Backend Setup
1. Install dependencies:
   ```bash
   cd rimki-backend
   npm install
   ```

2. Create `.env` file with:
   ```
   PORT=8080
   JWT_SECRET=your-secret-key-here
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account-key.json
   ```

3. Set up Google Forms API:
   - Create a Google Cloud Project
   - Enable Google Forms API
   - Create a service account and download the JSON key file
   - Place the key file as `service-account-key.json` in the backend root

4. Run the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd rimki-frontend
   npm install
   ```

2. Run the frontend:
   ```bash
   npm run dev
   ```

## API Endpoints

### Local Backend (localhost:8080)
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/quiz/create` - Create quiz with Google Forms integration
- `GET /api/quiz/list` - List created quizzes

### External API (10.1.24.54)
- `POST /api/chat/message` - Send chat message
- `POST /api/quiz/upload` - Upload documents
- `GET /api/quiz-data` - Get quiz data by language

## Features
- Multi-language quiz creation (Vietnamese, Japanese, English)
- Google Forms integration for quiz distribution
- External API integration for chat and document handling
- JWT-based authentication
