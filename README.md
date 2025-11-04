# Disaster Management System

> A full‑stack web application to report disasters, view live alerts, and coordinate response — with secure user authentication and a clean, responsive UI.

## Project Structure

```
Disaster-Management-System/
├── backend/                        # Node.js/Express API
│   ├── models/
│   │   ├── Report.js               # Report schema/model
│   │   └── User.js                 # User schema/model (bcrypt + methods)
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth (signup/login)
│   │   └── reportRoutes.js         # /api/reports (create/list reports)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # App bootstrap, MongoDB connect
│
├── frontend/                       # Static frontend
│   ├── assets/
│   │   ├── css/
│   │   │   ├── 2alerts.css
│   │   │   ├── 3report.css
│   │   │   └── 6login.css          # Shared auth styles
│   │   └── js/
│   │       └── auth.js             # Frontend auth utilities
│   ├── index.html                  # Landing page
│   └── pages/
│       ├── 2alerts.html            # Alerts feed (includes user reports)
│       ├── 3report.html            # Submit a disaster report
│       ├── 4relifcenter.html
│       ├── 5emergency.html
│       ├── login.html              # Login page
│       └── signup.html             # Signup page
│
└── README.md
```

## Key Features

- 🔐 Authentication: Email/password signup + login, JWT issued on success
- 📝 Reporting: Citizens can submit reports (type, severity, location, contacts)
- 🛠️ Alerts Feed: Combines static alerts with live user reports from MongoDB
- 🗺️ Map Interaction: Report page includes a location picker (Leaflet placeholder)
- 📱 Responsive UI: Bootstrap 5 + custom styles


## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas (via Mongoose)
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome Icons

---

## Getting Started

### 1) Backend (API)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/` directory with the following variables:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_change_this_to_a_random_string
PORT=5000
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 2) Frontend (Static)

Serve the `frontend/` folder with a local server and open `http://localhost:8000`:

```bash
# Using Python
cd frontend
python -m http.server 8000

# Using Node.js (http-server)
npx http-server frontend -p 8000
```

## API Reference

### Health

- `GET /api/health` → `{ success, message, timestamp }`

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ firstName, lastName, email, password, phone, role, location }`
  - Returns: JWT token and user data

- `POST /api/auth/login` - Login existing user
  - Body: `{ email, password }`
  - Returns: JWT token and user data

### Reports

- `POST /api/reports` - Create a new report
  - Body: `{ type, severity, title, description, address, city, state, pincode?, location?, contactName?, contactPhone, contactEmail?, anonymous? }`
  - Returns: `{ success, report }`

- `GET /api/reports` - List recent reports (newest first)
  - Returns: `{ success, reports: [...] }`


## Authentication Flow

- Signup (`frontend/pages/signup.html`) posts to `POST /api/auth/signup`
  - On success: token + user saved to `localStorage`; redirects to home
- Login (`frontend/pages/login.html`) posts to `POST /api/auth/login`
  - On success: token + user saved to `localStorage`; redirects to home
- Navbar button state (`frontend/assets/js/auth.js`)
  - If token exists → shows “Logout”; click clears `localStorage` and reloads
  - If no token → shows “Login” and links to `login.html`

---

## Reports → Alerts Integration

- Submit a report on `pages/3report.html`
  - Client posts to `POST /api/reports`
  - Required fields: type, severity, title, description, address, city, state, contactPhone
  - Optional: pincode, location (lat/lng), contactName, contactEmail, anonymous
- View reports on `pages/2alerts.html`
  - Client fetches from `GET /api/reports`
  - Newest reports are appended to the existing static alerts grid

---

## Troubleshooting

- Cannot connect to backend from frontend
  - Ensure backend is running on `http://localhost:5000`
  - Check browser console (F12) → Network tab
  - Try `curl http://localhost:5000/api/health`
- MongoDB connection error
  - Verify `MONGO_URI` and whitelist your IP in MongoDB Atlas
- Login/signup fails
  - Check backend logs; ensure required fields are sent

## Development

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `your_mongodb_atlas_connection_string` in `.env` with your actual connection string
5. Make sure to whitelist your IP address in MongoDB Atlas


