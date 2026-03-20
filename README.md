# SEO Analytics Dashboard

A web application that analyzes basic SEO elements of any given URL and presents the results in a simple, user-friendly dashboard.

---

## 🚀 Features

- Analyze page title and meta description
- Extract heading structure (H1, H2)
- Display structured SEO insights
- Clean and responsive UI
- Fast analysis using server-side HTML parsing

---

## 🛠️ Tech Stack

### Frontend

- Angular
- Tailwind CSS
- DaisyUI

### Backend

- Node.js
- Express.js
- Axios
- Cheerio

---

## ⚙️ How It Works

1. User enters a URL in the frontend
2. Request is sent to the backend API
3. Backend fetches the page HTML
4. HTML is parsed to extract SEO-related data
5. Results are returned and displayed in the dashboard

---

## 📦 Installation & Setup

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

## 📌 API Endpoint

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
  "title": "Example Page",
  "metaDescription": "This is an example description",
  "h1": ["Main Heading"],
  "h2": ["Section 1", "Section 2"]
}
```

---

## 🧠 Future Improvements

- SEO scoring system
- Performance metrics integration
- Error handling for invalid URLs
- Save analysis history
- Authentication and user accounts

---

## 📄 License

This project is for educational and portfolio purposes.
