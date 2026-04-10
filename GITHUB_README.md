# AI-Assisted Job Application Tracker

> A full-stack MERN application with AI-powered job description parsing and resume suggestions

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://mern.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 Overview

Track your job applications on an interactive Kanban board. The AI automatically parses job descriptions to extract key information and generates tailored resume bullet points to help you stand out.

### Key Features
- ✅ AI-powered job description parser (extracts company, role, skills, location, seniority)
- ✅ Intelligent resume suggestions tailored to each role
- ✅ Kanban board with drag-and-drop between 5 application stages
- ✅ Secure JWT authentication with bcrypt password hashing
- ✅ Full CRUD operations for job applications
- ✅ Responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Gemini API Key](https://aistudio.google.com/api-keys)

### Installation

1. **Clone & Install**
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
npm install
cd backend && npm install && cd ../frontend && npm install
```

2. **Configure Environment**
```bash
# Backend
cd backend && cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and OpenAI API key

# Frontend
cd ../frontend && cp .env.example .env
```

3. **Run Development Servers**
```bash
# From root directory
npm run dev
```

**Access the app at:** http://localhost:5173

[→ Detailed Setup Instructions](SETUP.md)

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Quick start guide (5 minutes)
- **[README.md](README.md)** - Full documentation with features and API endpoints
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Architecture and design patterns
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel, Railway, Heroku
- **[TESTING.md](TESTING.md)** - Manual testing checklist
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - What's been built

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for responsive design
- **React Beautiful DnD** for drag-and-drop
- **Zustand** for lightweight state management
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for stateless authentication
- **bcrypt** for password hashing
- **OpenAI API** for AI features

## 🎨 User Flow

```
1. User registers/logs in
   ↓
2. Lands on empty Kanban board
   ↓
3. Clicks "+ Add Application"
   ↓
4. Pastes job description
   ↓
5. AI parses JD → displays parsed info
   ↓
6. AI generates resume suggestions
   ↓
7. User saves → card appears in "Applied"
   ↓
8. User drags cards as they progress
   ↓
9. User can edit, delete, or view details
```

## 🔑 Core API Endpoints

```
Authentication
  POST   /api/auth/register        Register new user
  POST   /api/auth/login           Login user

Applications (Protected)
  GET    /api/applications         Get all user's applications
  POST   /api/applications         Create application
  GET    /api/applications/:id     Get single application
  PUT    /api/applications/:id     Update application
  DELETE /api/applications/:id     Delete application

AI Features (Protected)
  POST   /api/applications/parse        Parse job description
  POST   /api/applications/suggestions  Generate resume suggestions
```

## 📊 Project Stats

- **39 files** created
- **~1800 lines** of code
- **16 backend** files (models, services, routes, middleware)
- **14 frontend** files (components, pages, store, API)
- **6 documentation** files

## 🏛️ Architecture

### Service Layer Pattern
```
Client Request
    ↓
Routes (HTTP concerns)
    ↓
Services (Business logic)
    ↓
Database (Data persistence)
```

### Frontend State Flow
```
Component Action
    ↓
API Call (axios)
    ↓
Zustand Store Update
    ↓
Component Re-render
```

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens for stateless auth
- ✅ Protected routes with auth middleware
- ✅ No hardcoded secrets (use .env files)
- ✅ Input validation on backend
- ✅ CORS configured for frontend origin

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build:frontend
# Deploy dist/frontend to Vercel
```

### Backend (Railway/Heroku)
```bash
npm run build:backend
# Deploy backend to Railway or Heroku
```

[→ Full Deployment Guide](DEPLOYMENT.md)

## 🧪 Testing

Comprehensive manual testing checklist available in [TESTING.md](TESTING.md):
- Authentication flows
- Kanban board interactions
- AI parsing accuracy
- Error handling
- Cross-browser compatibility
- Performance benchmarks

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=generate_a_strong_random_key
GEMINI_API_KEY=sk-...
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

**Note:** Never commit actual `.env` files. Use `.env.example` as template.

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- TypeScript in production code
- Modern React patterns (hooks, context)
- REST API design
- Authentication & authorization
- Integration with external APIs
- Responsive UI design
- Drag-and-drop UX
- Error handling and loading states

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### OpenAI API Error
- Verify API key at https://platform.openai.com/api-keys
- Check account has available credits
- Ensure .env file isn't committed

### Port Already in Use
```bash
# Change PORT in backend/.env
# Vite will prompt for different port if 5173 is taken
```

[→ More troubleshooting](SETUP.md)

## 💡 Design Decisions

| Decision | Why |
|----------|-----|
| Zustand over Redux | Low complexity, minimal boilerplate |
| React Beautiful DnD | Mature, accessible drag-and-drop |
| JWT in localStorage | Stateless, scalable authentication |
| Tailwind CSS | Rapid prototyping, consistent design |
| Service layer | Easy testing, separation of concerns |

## ✨ Future Enhancements

- [ ] Dashboard with statistics
- [ ] Email reminders for follow-ups
- [ ] Search and filter functionality
- [ ] Export to CSV
- [ ] Dark mode
- [ ] Automated tests (Jest, Vitest)
- [ ] Real-time updates (WebSockets)
- [ ] Mobile app (React Native)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

- 📖 Check [DEVELOPMENT.md](DEVELOPMENT.md) for architecture
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting
- 🧪 Review [TESTING.md](TESTING.md) for test scenarios
- 📝 Read main [README.md](README.md) for detailed docs

## 🎉 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker

# 2. Install dependencies
npm install
cd backend && npm install && cd ../frontend && npm install

# 3. Configure environment variables
cd ../backend && cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, OpenAI API key

cd ../frontend && cp .env.example .env

# 4. Start development servers
npm run dev

# 5. Open http://localhost:5173 and start tracking!
```

---

**Happy job hunting! 🚀**

