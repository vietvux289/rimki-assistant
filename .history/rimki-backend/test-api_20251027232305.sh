#!/bin/bash
# RIMKI Backend API Test Script
# This script tests all the API endpoints

BASE_URL="http://localhost:8080"

echo ""
echo "========================================"
echo "RIMKI Backend API Testing Script"
echo "========================================"
echo ""

# 1. Health Check
echo "[1/7] Testing Health Check..."
response=$(curl -s http://localhost:8080/api/health)
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
    echo "   Response: $response"
else
    echo "❌ Health check failed"
    exit 1
fi

# 2. Login
echo ""
echo "[2/7] Testing Login..."
response=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

token=$(echo $response | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -n "$token" ]; then
    echo "✅ Login successful"
    echo "   Token: ${token:0:50}..."
else
    echo "❌ Login failed"
    exit 1
fi

# 3. Get Profile
echo ""
echo "[3/7] Testing Get Profile..."
response=$(curl -s http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer $token")
if [ $? -eq 0 ]; then
    echo "✅ Get profile successful"
    username=$(echo $response | grep -o '"username":"[^"]*' | grep -o '[^"]*$')
    echo "   Username: $username"
else
    echo "❌ Get profile failed"
fi

# 4. Send Chat Message
echo ""
echo "[4/7] Testing Chat Message..."
response=$(curl -s -X POST http://localhost:8080/api/chat/message \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the company security policy?"}')
if [ $? -eq 0 ]; then
    echo "✅ Chat message successful"
    message=$(echo $response | grep -o '"message":"[^"]*' | grep -o '[^"]*$')
    echo "   Response: ${message:0:100}..."
else
    echo "❌ Chat message failed"
fi

# 5. Create Quiz
echo ""
echo "[5/7] Testing Create Quiz..."
response=$(curl -s -X POST http://localhost:8080/api/quiz/create \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security Policy Quiz",
    "questions": [
      {
        "question": "What is the minimum password length?",
        "type": "multiple-choice",
        "options": ["6 characters", "8 characters", "10 characters", "12 characters"],
        "correctAnswer": "8 characters"
      }
    ]
  }')
if [ $? -eq 0 ]; then
    echo "✅ Create quiz successful"
    quiz_id=$(echo $response | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
    title=$(echo $response | grep -o '"title":"[^"]*' | grep -o '[^"]*$')
    echo "   Quiz ID: $quiz_id"
    echo "   Quiz Title: $title"
else
    echo "❌ Create quiz failed"
fi

# 6. List Quizzes
echo ""
echo "[6/7] Testing List Quizzes..."
response=$(curl -s http://localhost:8080/api/quiz/list \
  -H "Authorization: Bearer $token")
if [ $? -eq 0 ]; then
    echo "✅ List quizzes successful"
    quiz_count=$(echo $response | grep -o '"quizzes":\[*' | wc -l)
    echo "   Total quizzes found"
else
    echo "❌ List quizzes failed"
fi

# 7. Test Invalid Credentials
echo ""
echo "[7/7] Testing Error Handling (Invalid Credentials)..."
response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"invalid","password":"invalid"}')
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "401" ]; then
    echo "✅ Error handling successful (401 Unauthorized)"
else
    echo "⚠️ Unexpected response: $status_code"
fi

echo ""
echo "========================================"
echo "All Tests Completed!"
echo "========================================"
echo ""

