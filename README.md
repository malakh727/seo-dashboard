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
- SEO scoring system (0–100) with per-criterion breakdown
- Score delta tracking vs. previous analysis of the same URL
- Analysis history (up to 10 entries, stored in localStorage)
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

---

## How It Works

1. User enters a URL in the frontend
2. Request is sent to the backend API
3. Backend validates the URL and fetches the page HTML
4. HTML is parsed with Cheerio to extract SEO-related data
5. Frontend scores the result (0–100) and displays the full breakdown

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/malakh727/seo-dashboard.git
cd seo-dashboard
```

---

### 2. Setup Backend

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

### 3. Setup Frontend

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

## API Endpoint

**POST** `/api/seo/analyze`

### Request Body:

```json
{
  "url": "https://example.com"
}
```

### Response Example:

```json
{
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
  "wordCount": 412
}
```

---

## Future Improvements

- Performance metrics integration (Core Web Vitals)
- Save analysis history to a database
- Authentication and user accounts
- Shareable analysis report links
- Competitor comparison mode

---

## License

This project is for educational and portfolio purposes.
