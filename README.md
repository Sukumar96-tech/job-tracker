# AI-Assisted Job Application Tracker

A full-stack MERN application that helps users track job applications on a Kanban board with AI-powered job description parsing and resume suggestions.

## Features

- **User Authentication**: Register and login with email/password using JWT
- **Kanban Board**: Drag-and-drop applications across 5 stages (Applied, Phone Screen, Interview, Offer, Rejected)
- **AI Job Parser**: Automatically extract company, role, skills, location, and seniority from job descriptions
- **Resume Suggestions**: Generate 4-5 tailored resume bullet points for each job
- **Application Management**: Create, read, update, and delete job applications
- **Persistent State**: Stay logged in after page refresh
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (fast build tooling)
- React Router for navigation
- React Beautiful DnD for drag-and-drop
- Zustand for state management
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- JWT with bcrypt for authentication
- OpenAI API for AI features
- CORS for cross-origin requests

## Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API key (from https://platform.openai.com/api-keys)

## Installation

### 1. Clone the Repository
```bash
git clone <repo-url>
cd job-tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env`:**
```

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobtracker
JWT_SECRET=your_secret_key_here
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

**Start MongoDB** (if running locally):
```bash
mongod
```

**Start Backend Server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend Development Server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Applications
- `GET /api/applications` - Get all applications (protected)
- `GET /api/applications/:id` - Get single application (protected)
- `POST /api/applications` - Create application (protected)
- `PUT /api/applications/:id` - Update application (protected)
- `DELETE /api/applications/:id` - Delete application (protected)
- `POST /api/applications/parse` - Parse job description with AI (protected)
- `POST /api/applications/suggestions` - Generate resume suggestions (protected)

## Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Application**: Click "+ Add Application" to paste a job description
3. **AI Parse**: The AI automatically extracts job details
4. **Review & Save**: Review parsed data and resume suggestions, then save
5. **Track Progress**: Drag cards across the Kanban board as you progress
6. **Edit/Delete**: Click any card to view details, edit, or delete

## Project Structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── User.ts
│   │   │   └── Application.ts
│   │   ├── services/             # Business logic
│   │   │   ├── AuthService.ts
│   │   │   ├── AIService.ts
│   │   │   └── ApplicationService.ts
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.ts
│   │   │   └── applications.ts
│   │   ├── middleware/           # Custom middleware
│   │   │   └── auth.ts
│   │   └── types/                # TypeScript types
│   │       └── index.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── main.tsx              # React entry point
    │   ├── App.tsx               # Main app component
    │   ├── index.css             # Tailwind + custom styles
    │   ├── components/           # Reusable components
    │   │   ├── KanbanBoard.tsx
    │   │   ├── ApplicationCard.tsx
    │   │   ├── ApplicationDetailModal.tsx
    │   │   └── AddApplicationModal.tsx
    │   ├── pages/                # Page components
    │   │   ├── LoginPage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── api/                  # API client
    │   │   └── client.ts
    │   ├── store/                # State management
    │   │   └── index.ts
    │   └── types/                # TypeScript types
    │       └── index.ts
    ├── index.html
    ├── .env.example
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.cjs
    ├── tsconfig.json
    ├── package.json
    └── .gitignore
```

## Key Design Decisions

1. **Service Layer Pattern**: All business logic (auth, AI, database) is in service classes, not route handlers
2. **Zustand for State**: Lightweight state management for auth and applications
3. **JWT Authentication**: Secure, stateless authentication with tokens
4. **AI Integration**: Centralized AIService handles all OpenAI API calls
5. **TypeScript Everywhere**: Strict TypeScript throughout for type safety
6. **Drag-and-Drop**: React Beautiful DnD for smooth drag-and-drop UX
7. **Environment Variables**: Never commit secrets; use .env files

## Stretch Goals (Optional)

- [ ] Dashboard with application statistics
- [ ] Follow-up reminders with overdue highlights
- [ ] Search and filter on the Kanban board
- [ ] Export to CSV
- [ ] Dark mode
- [ ] Streaming AI responses for faster feedback
- [ ] Deploy to Vercel (frontend) and Heroku/Railway (backend)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env

### OpenAI API Error
- Verify API key is correct and active: https://platform.openai.com/api-keys
- Check you have available credits/quota
- Ensure `.gitignore` prevents committing actual `.env` file

### CORS Error
- Frontend proxy setup in vite.config.ts should forward API calls to backend
- Ensure backend has CORS enabled in index.ts

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Vite will prompt for a different port

## Deployment

### Backend (Optional)
Options: Heroku, Railway, Render, AWS EC2
- Build: `npm run build`
- Start: `npm start`
- Set environment variables on hosting platform

### Frontend (Optional)
Options: Vercel, Netlify, GitHub Pages
- Build: `npm run build`
- Deploy the `dist` folder
- Set VITE_API_URL to your backend URL

## Git Workflow

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial setup: MERN stack with AI integration"

# Make meaningful commits for each feature
git commit -m "feat: Add AI job description parser"
git commit -m "feat: Implement Kanban board with drag-and-drop"
```

## Security Notes

1. Never commit `.env` file - use `.env.example` as template
2. JWT_SECRET should be a strong, random string in production
3. Passwords are hashed with bcrypt (10 rounds)
4. API endpoints are protected with JWT middleware
5. Validate all user input on backend

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobtracker
JWT_SECRET=your_secret_key_here
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## License

MIT

## Support

For issues or questions, open a GitHub issue in the repository.
