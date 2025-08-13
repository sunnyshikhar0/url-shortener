# URL Shortener

A simple full-stack URL Shortener with create, list, copy, and delete functionality built using:
- Backend: Express + Mongoose
- Frontend: React (Vite) + TailwindCSS
- Database: MongoDB Atlas
- ID Generation: shortid

## Features
- Shorten long URLs into compact links
- Redirect via short URL (dynamic route)
- Prevent duplicate short IDs (unique constraint)
- List all previously created URLs
- Copy short URL to clipboard
- Delete stored URLs
- Timestamp tracking (createdAt)
- Clean UI with TailwindCSS

## Project Structure
```
url-shortner/
  backend/
    Controllers/
      longurl.js
    Models/
      LongUrl.js
    .env
    server.js
    package.json
  frontend/
    src/
      components/
        UrlShortner.jsx
        UrlLists.jsx
      App.jsx
      main.jsx
    package.json
```

Key files:
- Backend entry: [backend/server.js](backend/server.js)
- Controller logic: [backend/Controllers/longurl.js](backend/Controllers/longurl.js)
- Mongoose model: [backend/Models/LongUrl.js](backend/Models/LongUrl.js)
- Shorten form UI: [frontend/src/components/UrlShortner.jsx](frontend/src/components/UrlShortner.jsx)
- URL list + delete UI: [frontend/src/components/UrlLists.jsx](frontend/src/components/UrlLists.jsx)

## Data Model
Defined in [backend/Models/LongUrl.js](backend/Models/LongUrl.js):
```js
shortId: String (unique)
longUrl: String
shortUrl: String
createdAt: Date (default now)
```

## Environment Variables (backend/.env)
```
MONGODB_URI=your-mongodb-connection-string
PORT=8080
BASE_URL=http://localhost:8080
```
BASE_URL is used to build the final shortUrl.

## Installation

### 1. Clone
```bash
git clone <repo-url>
cd url-shortner
```

### 2. Backend Setup
```bash
cd backend
npm install
# create .env (as above)
node server.js
```

### 3. Frontend Setup
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend defaults to http://localhost:5173 and calls backend at http://localhost:8080.

## Workflows

### 1. Shorten a URL
1. User enters a URL in [`UrlShortner`](frontend/src/components/UrlShortner.jsx)
2. POST /api/shorten → [`shortenUrl`](backend/Controllers/longurl.js)
3. Mongoose creates a document (`LongUrl`)
4. State updates; list refresh triggered

### 2. Redirect
1. User opens short link (e.g. http://localhost:8080/abc123)
2. GET /:shortId → [`redirectShortUrl`](backend/Controllers/longurl.js)
3. Look up by shortId
4. 302 redirect to original longUrl

### 3. List All URLs
1. Component mount / refresh in [`UrlLists`](frontend/src/components/UrlLists.jsx)
2. GET /api/urls → [`getAllStoredUrls`](backend/Controllers/longurl.js)
3. Renders table with createdAt and actions

### 4. Delete a URL
1. User clicks Delete
2. DELETE /api/urls/:id → [`deleteUrl`](backend/Controllers/longurl.js)
3. On success, removed from local state

## API Reference

### POST /api/shorten
Request:
```json
{ "originalUrl": "https://example.com/very/long/path" }
```
Response:
```json
{
  "success": true,
  "message": "URL shortened successfully",
  "data": {
    "shortId": "abc123",
    "longUrl": "https://example.com/very/long/path",
    "shortUrl": "http://localhost:8080/abc123"
  }
}
```

### GET /api/urls
Response:
```json
{
  "success": true,
  "urls": [
    {
      "_id": "...",
      "shortId": "abc123",
      "longUrl": "https://example.com/very/long/path",
      "shortUrl": "http://localhost:8080/abc123",
      "createdAt": "2025-01-01T12:34:56.789Z"
    }
  ]
}
```

### DELETE /api/urls/:id
Response (success):
```json
{ "success": true, "message": "URL deleted", "id": "..." }
```

### GET /:shortId
Redirects (302) to stored longUrl or 404 JSON if not found.

## Core Controller Functions
Located in [backend/Controllers/longurl.js](backend/Controllers/longurl.js):
- `shortenUrl` – create shortened URL
- `redirectShortUrl` – redirect handler
- `getAllStoredUrls` – list documents
- `deleteUrl` – remove document

## Frontend Components
- [`UrlShortner`](frontend/src/components/UrlShortner.jsx): form + result card
- [`UrlLists`](frontend/src/components/UrlLists.jsx): table with copy + delete actions
State refresh is coordinated via a counter prop in [App.jsx](frontend/src/App.jsx).


---
Minimal, functional, extensible.