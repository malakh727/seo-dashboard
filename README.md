# SEO Analytics Dashboard

A web application that analyzes SEO elements of any given URL and presents the results in a clean, interactive dashboard.
<img width="1833" height="892" alt="image" src="https://github.com/user-attachments/assets/4a7c3bee-a92a-4ce0-8ca9-acd515b6b5e7" />

---

## Features

- Analyze page title and meta description with character-count guidance
- Extract and display heading structure (H1, H2)
- Open Graph tag analysis (og:title, og:description, og:image preview)
- Canonical URL detection
- Image count and missing alt-text reporting
- Word count analysis
- SEO scoring system (0–100) with per-criterion breakdown, calculated server-side
- Score delta tracking vs. previous analysis of the same URL
- Persistent analysis history stored in MongoDB (unlimited entries)
- Score trend charts per domain
- Side-by-side URL comparison
- Shareable report links (`/report?id=<id>`)
- Copy results to clipboard
- Export results as JSON
- Clean, responsive UI with loading skeletons
- Rate limiting and private IP blocking on the backend

---

## Tech Stack

### Frontend

- Angular 21
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Axios
- Cheerio
- MongoDB + Mongoose

---

## How It Works

1. User enters a URL in the frontend
2. Request is sent to the backend API
3. Backend validates the URL and fetches the page HTML
4. HTML is parsed with Cheerio to extract SEO-related data
5. Backend calculates the SEO score (0–100) and saves the full analysis to MongoDB
6. Frontend displays the result and updates the history from the database

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/malakh727/seo-dashboard.git
cd seo-dashboard
```

---

### 2. Start MongoDB

Using Docker (recommended):

```bash
docker run -d --name mongodb -p 27017:27017 mongo:8
```

Or use [MongoDB Atlas](https://cloud.mongodb.com) (free tier) and set the connection string in `backend/.env`.

---

### 3. Configure the backend environment

Create `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/seo-dashboard
PORT=3000
```

---

### 4. Setup Backend

```bash
cd backend
npm install
node src/app.js
```

Backend will run on:

```
http://localhost:3000
```

---

### 5. Setup Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend will run on:

```
http://localhost:4200
```

---

## API Endpoints

### Analyze a URL

**POST** `/api/seo/analyze`

Request body:
```json
{ "url": "https://example.com" }
```

Response:
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "url": "https://example.com",
  "analyzedAt": "2026-04-04T17:23:51.102Z",
  "title": "Example Domain",
  "metaDescription": "This is an example description.",
  "h1": ["Example Domain"],
  "h2": ["Section One", "Section Two"],
  "ogTitle": "Example Domain",
  "ogDescription": "An example OG description.",
  "ogImage": "https://example.com/og-image.png",
  "canonicalUrl": "https://example.com/",
  "imageCount": 3,
  "imagesWithoutAlt": 1,
  "wordCount": 412,
  "score": 85,
  "scoreBreakdown": [
    { "label": "Page title present", "points": 10, "maxPoints": 10, "passed": true },
    { "label": "Title length (30–60 chars)", "points": 15, "maxPoints": 15, "passed": true }
  ]
}
```

### History

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/seo/history` | Get all analyses (sorted by date desc) |
| `GET` | `/api/seo/history/:id` | Get a single analysis by ID |
| `DELETE` | `/api/seo/history/:id` | Delete a single analysis |
| `DELETE` | `/api/seo/history` | Delete all analyses |

---

## Future Improvements

- Performance metrics integration (Core Web Vitals)
- Authentication and user accounts
- Competitor comparison mode (in progress)

---

## License

This project is for educational and portfolio purposes.
