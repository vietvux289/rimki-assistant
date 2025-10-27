# RIMKI Backend API Test Script
# This script tests all the API endpoints

$baseUrl = "http://localhost:8080"
$headers = @{}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RIMKI Backend API Testing Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Health Check
Write-Host "[1/7] Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Login
Write-Host "`n[2/7] Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $response.token
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

# 3. Get Profile
Write-Host "`n[3/7] Testing Get Profile..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method Get -Headers $headers
    Write-Host "✅ Get profile successful" -ForegroundColor Green
    Write-Host "   Username: $($response.username)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get profile failed: $_" -ForegroundColor Red
}

# 4. Send Chat Message
Write-Host "`n[4/7] Testing Chat Message..." -ForegroundColor Yellow
try {
    $chatBody = @{
        message = "What is the company security policy?"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/chat/message" -Method Post -Body $chatBody -Headers $headers -ContentType "application/json"
    Write-Host "✅ Chat message successful" -ForegroundColor Green
    Write-Host "   Response: $($response.message.Substring(0, 100))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Chat message failed: $_" -ForegroundColor Red
}

# 5. Create Quiz
Write-Host "`n[5/7] Testing Create Quiz..." -ForegroundColor Yellow
try {
    $quizBody = @{
        title = "Security Policy Quiz"
        questions = @(
            @{
                question = "What is the minimum password length?"
                type = "multiple-choice"
                options = @("6 characters", "8 characters", "10 characters", "12 characters")
                correctAnswer = "8 characters"
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/quiz/create" -Method Post -Body $quizBody -Headers $headers -ContentType "application/json"
    Write-Host "✅ Create quiz successful" -ForegroundColor Green
    Write-Host "   Quiz ID: $($response.quiz.id)" -ForegroundColor Gray
    Write-Host "   Quiz Title: $($response.quiz.title)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Create quiz failed: $_" -ForegroundColor Red
}

# 6. List Quizzes
Write-Host "`n[6/7] Testing List Quizzes..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/quiz/list" -Method Get -Headers $headers
    Write-Host "✅ List quizzes successful" -ForegroundColor Green
    Write-Host "   Total quizzes: $($response.quizzes.Count)" -ForegroundColor Gray
    if ($response.quizzes.Count -gt 0) {
        foreach ($quiz in $response.quizzes) {
            Write-Host "   - $($quiz.title) (ID: $($quiz.id))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ List quizzes failed: $_" -ForegroundColor Red
}

# 7. Test Invalid Credentials
Write-Host "`n[7/7] Testing Error Handling (Invalid Credentials)..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "invalid"
        password = "invalid"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "⚠️ Error handling test failed (should have returned error)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Error handling successful (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Unexpected error: $_" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All Tests Completed!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

