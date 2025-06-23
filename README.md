# ProLearn - Learning Management System

ProLearn is a modern Learning Management System (LMS) built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a responsive and scalable platform for managing courses, instructors, students, and payments.

## 🔧 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Zustand
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT-based
* **Payments:** Stripe Integration

## ✨ Features

### 👩‍🏫 For Students

* Register/Login with secure authentication
* Browse available lectures and sections
* Track individual lecture progress (section-level completion)
* Watch lecture videos (with access control)
* View course levels and details
* Payment handling via Stripe

### 🧑‍💼 For Admins

* Dashboard to manage:

  * Students, Lectures, Sections
  * Track students
* Upload lecture videos/images
* Monitor and audit user activities

## 📁 Project Structure

```bash
ProLearn/
├── client/               # Frontend (React + Vite)
│   ├── pages/            # Pages (Home, Login, Register, Level, etc.)
│   ├── components/       # Reusable UI components (e.g., LectureCard, Sidebar)
│   ├── store/            # Zustand state stores
│   └── ...
├── server/               # Backend (Express API)
│   ├── models/           # Mongoose schemas (Lecture, Section, User, etc.)
│   ├── routes/           # Route handlers
│   ├── controllers/      # Logic for routes
│   └── utils/            # Middleware (auth, etc.)
│   └── ...
└── README.md
```

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/mohamed-osamaaa/ProLearn.git
cd ProLearn
```

### 2. Install Dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Environment Variables

Create `.env` files in both `client/` and `server/` with appropriate variables:

#### server/.env

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=...
CLIENT_URL=http://localhost:5173
```

#### client/.env

```
VITE_API_URL=http://localhost:5000
```

### 4. Start the App

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

## 🛡️ Security Features

* JWT-based session authentication
* Password hashing
* Admin role with access control
* Request rate limiting using `express-rate-limit`
* HTTP header protection using `helmet`

## 📚 Future Enhancements

* Quiz and assignment modules
* Real-time notifications
* Localization (multi-language support)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 🎥 Demo Videos

https://github.com/user-attachments/assets/9ff0770d-c36a-4ad2-905f-cdcaaa8382db

## 📄 License

This project is licensed under the MIT License.

---

Developed with ❤️ by Mohamed Osama and contributors

