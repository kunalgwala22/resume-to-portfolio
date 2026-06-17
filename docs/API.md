# PortfolioVerse AI - Endpoint Routing Directory

All API paths are prefixed by `/api` when hosted. When running locally or under Docker, client requests map to `http://localhost:3001/api`.

---

## 1. Authentication Module (`/api/auth`)

### Register Account
- **Path**: `POST /auth/register`
- **Payload**:
  ```json
  {
    "email": "developer@example.com",
    "username": "coderdev",
    "fullName": "Jane Doe",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_uuid",
        "email": "developer@example.com",
        "username": "coderdev",
        "fullName": "Jane Doe",
        "avatarUrl": null
      },
      "accessToken": "eyJhbG..."
    }
  }
  ```

### Login
- **Path**: `POST /auth/login`
- **Payload**:
  ```json
  {
    "email": "developer@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` (sets `refreshToken` in httpOnly cookie)

### Refresh Access Token
- **Path**: `POST /auth/refresh`
- **Payload**: None (reads `refreshToken` cookie)
- **Response**: `200 OK` returns new `accessToken`.

---

## 2. Resume Parsing Module (`/api/resume`)

### Upload Resume File
- **Path**: `POST /resume/upload`
- **Payload**: `multipart/form-data` containing file field `file` (PDF/DOCX).
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "resume": { "id": "res_uuid", "filename": "resume.pdf", "parseStatus": "PROCESSING" }
    }
  }
  ```

### List Parsed Resumes
- **Path**: `GET /resume`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` returns array of resumes.

### Fine-Tune Sections
- **Path**: `PUT /resume/:id/sections`
- **Payload**:
  ```json
  {
    "skills": [{ "name": "React", "level": "EXPERT", "category": "Frontend" }],
    "experiences": [],
    "projects": [],
    "educations": [],
    "certifications": [],
    "socialLinks": []
  }
  ```

### Activate Resume
- **Path**: `POST /resume/:id/activate`
- **Response**: `200 OK` (switches active state to true, updating portfolio values).

---

## 3. Portfolio Configurations (`/api/portfolio`)

### Fetch Settings
- **Path**: `GET /portfolio`
- **Response**: `200 OK` returning template configurations, SEO variables, theme colors.

### Save Configurations
- **Path**: `PUT /portfolio`
- **Payload**: `PortfolioUpdateInput` fields.
- **Response**: `200 OK`.

### Toggle Visibility
- **Path**: `POST /portfolio/publish`
- **Payload**: `{ "isPublished": true }`

### Get Public Digital Twin
- **Path**: `GET /portfolio/public/:username`
- **Auth**: None (public routing endpoint).
- **Response**: `200 OK` returning complete payload including candidate skills, jobs, and theme configs.

---

## 4. AI & Digital Twin Chat (`/api/ai`)

### AI Bio Sync
- **Path**: `POST /ai/generate-bio`
- **Response**: `200 OK` returning generated summary paragraphs.

### Recruiter Chat Assistant
- **Path**: `POST /ai/recruiter-chat`
- **Payload**:
  ```json
  {
    "username": "coderdev",
    "messages": [
      { "role": "user", "content": "Does this candidate have experience with Kubernetes?" }
    ]
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "reply": "Yes! Jane has deployed several Node.js microservices into Kubernetes clusters during her tenure at TechCorp."
    }
  }
  ```

---

## 5. Visitor Analytics (`/api/analytics`)

### Overview Cards
- **Path**: `GET /analytics/overview`
- **Response**: `200 OK` returning total views, unique visitors count, and average time spent.

### Time-Series Views
- **Path**: `GET /analytics/views?days=30`
- **Response**: `200 OK` returns list of date view frequencies.
