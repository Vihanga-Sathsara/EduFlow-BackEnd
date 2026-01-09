# EduFlow Backend

![Node.js](https://img.shields.io/badge/Node.js-v18.17.1-brightgreen)
![Express](https://img.shields.io/badge/Express-4.x-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

**EduFlow Backend** is built with **Node.js, Express, MongoDB, Mongoose, and TypeScript**, providing a RESTful API for the EduFlow LearnHub platform.

It supports user authentication, role-based access, ebook management, learning paths, and AI query endpoints.

---

## Live Backend

Deployed backend:  
[https://edu-flow-back-end.vercel.app](https://edu-flow-back-end.vercel.app)  

> 

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eduflow
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
````

> ⚠️ Never commit `.env` to GitHub. Add variables to your deployment platform (Vercel, Railway, Render).

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Vihanga-Sathsara/EduFlow-BackEnd.git
cd EduFlow-BackEnd
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open browser:

```
http://localhost:5000
```

5. Build for production:

```bash
npm run build
npm start
```

---

## Folder Structure

```
EduFlow-BackEnd/
├─ src/
│  ├─ controllers/   # Route handlers
│  ├─ models/        # Mongoose schemas
│  ├─ routes/        # Express routes
│  ├─ middleware/    # Auth, role-based access
│  ├─ utils/         # Helpers: Cloudinary, AI, etc.
│  └─ config/        # DB & cloudinary config
├─ package.json
├─ tsconfig.json
├─ .env              # Not committed
└─ README.md
```

---

## Features

* JWT-based authentication and role-based authorization
* Admin/User roles for access control
* Ebook upload & management via Cloudinary (PDF & raw files)
* Recently uploaded ebooks retrieval
* Learning paths management
* AI query endpoint integration
* Modular RESTful API design

---

## API Endpoints

### Auth

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | /api/v1/auth/register | Register a new user |
| POST   | /api/v1/auth/login    | Login user          |

### Ebook

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| POST   | /api/v1/ebook/upload-ebook | Upload ebook (Admin only) |
| GET    | /api/v1/ebook/all          | Get all ebooks            |

### Learning Path

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| GET    | /api/v1/learning-path/all    | Get all learning paths   |
| POST   | /api/v1/learning-path/create | Create new learning path |

### AI

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | /api/v1/ai/query | Send prompt to AI model |

---

## Example API Usage (Postman / CURL)

**Login**

```bash
curl -X POST https://your-backend-url.vercel.app/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@example.com", "password":"password123"}'
```

**Upload Ebook (Admin)**

```bash
curl -X POST https://your-backend-url.vercel.app/api/v1/ebook/upload-ebook \
-H "Authorization: Bearer <JWT_TOKEN>" \
-F "file=@/path/to/ebook.pdf" \
-F "title=OOP" \
-F "author=Kasun" \
-F "category=Programming" \
-F "description=Good for all" \
-F "uploadedBy=<ADMIN_USER_ID>"
```

---

## Notes

* **Admin-only routes** protected via middleware
* **File uploads** handled via Cloudinary; make sure `CLOUDINARY_*` variables are correct
* API structured to be modular and extendable
* `.env` never committed

---

## License

MIT © 2026 EduFlow




