# M365 Learning Hub

A gamified web application designed to train agents on Microsoft 365 products through interactive learning modules, quizzes, achievement badges, and real-time leaderboards.

**Live Demo:** [ms365-academy.vercel.app](https://ms365-academy.vercel.app)

---

## Overview

M365 Learning Hub combines structured learning with gamification to motivate continuous Microsoft 365 training. Agents review curated learning materials linked to official Microsoft documentation, take randomized quizzes to test their knowledge, earn points and badges based on performance, and compete on a real-time leaderboard [1].

### How It Works

1. Agents register and log in to the platform
2. Browse available learning modules covering M365 products
3. Review learning resources linked to official Microsoft documentation
4. Take quizzes with 5 randomly selected questions from a pool of 15+
5. Earn points, unlock achievement badges, and climb the leaderboard
6. Admins manage content, users, and view analytics

---

## Features

### For Users

- **Interactive Dashboard** — Real-time stats synced from the database including score, rank, badges earned, and recent activity
- **Learning Modules** — Six M365 modules covering Teams, SharePoint, Outlook, OneDrive, Security & Compliance, and Power Platform
- **Randomized Quizzes** — 5 questions randomly selected from a pool of 15+ per module with instant feedback
- **Achievement Badges** — 12 unlockable badges across five categories: Milestones, Excellence, Points, Dedication, and Exploration
- **Real-time Leaderboard** — Top 50 users ranked by total score with personalized rank tracking
- **User Profiles** — Comprehensive stats, module progress, and rank progression

### For Admins

- **User Management** — Promote, demote, reset scores, and delete users
- **Module Manager** — Create new modules, add quiz questions, and manage learning resources
- **Analytics Dashboard** — KPIs, module performance metrics, top performers, badge distribution, and registration trends
- **Role-based Access** — First registered user becomes admin automatically

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| State Management | React Context + localStorage |
| Styling | Custom CSS (no framework) |
| Backend | Vercel Serverless Functions (Node.js 18) |
| Database | Neon Postgres (PostgreSQL 16) |
| Authentication | bcryptjs for password hashing |
| Hosting | Vercel (Hobby plan) |

---

## Project Structure

```
m365-learning-hub/
├── api/                          # Vercel Serverless Functions
│   ├── admin.js                  # User management + analytics
│   ├── auth.js                   # Login + registration
│   ├── badges.js                 # Badge checking and awarding
│   ├── content.js                # Modules + questions + resources CRUD
│   ├── scores.js                 # Score submission + leaderboard + stats
│   ├── seed.js                   # One-time data population
│   └── setup.js                  # Database table creation
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root component with routing
│   ├── App.css                   # Global styles
│   ├── context/
│   │   └── AppContext.jsx        # Global state management
│   ├── data/
│   │   └── modules.js            # Quiz constants
│   ├── services/
│   │   └── api.js                # API helper functions
│   └── components/
│       ├── AuthPage.jsx          # Login and registration
│       ├── Header.jsx            # Top navigation bar
│       ├── NavTabs.jsx           # Tab navigation
│       ├── Dashboard.jsx         # User dashboard
│       ├── Modules.jsx           # Module listing
│       ├── ModuleDetail.jsx      # Single module view
│       ├── Quiz.jsx              # Quiz engine
│       ├── QuizResults.jsx       # Quiz results display
│       ├── Leaderboard.jsx       # Real-time leaderboard
│       ├── Profile.jsx           # User profile
│       ├── Badges.jsx            # Achievement badges gallery
│       ├── AdminPanel.jsx        # Admin user management
│       ├── AdminAnalytics.jsx    # Analytics dashboard
│       └── AdminModules.jsx      # Module and question manager
├── index.html
├── package.json
└── vite.config.js
```

---

## Database Schema

The application uses six database tables [1]:

- **users** — Stores registered accounts with bcrypt-hashed passwords and role assignments
- **modules** — Stores learning modules with icons, titles, descriptions, and active status
- **questions** — Stores quiz questions with four answer options and the correct answer index
- **resources** — Stores learning resource links associated with modules
- **scores** — Tracks each user's best score, attempt count, and pass status per module
- **user_badges** — Records which badges each user has earned and when

---

## Gamification System

### Scoring

| Result | Points |
|---|---|
| Each correct answer | 20 points |
| Perfect score bonus (5/5) | +30 points |
| Maximum per quiz | 130 points |

A minimum of 3 out of 5 correct answers is required to pass. Users may retake quizzes unlimited times, and only the best score is recorded [1].

### Achievement Badges

| Badge | Requirement |
|---|---|
| First Steps | Complete your first quiz |
| Passing Grade | Pass your first quiz |
| Perfectionist | Score 5/5 on any quiz |
| Quick Learner | Pass a quiz on first attempt |
| Halfway There | Pass 3 different modules |
| Completionist | Pass all available modules |
| Scholar | Earn 200+ total points |
| Expert | Earn 400+ total points |
| M365 Master | Earn 600+ total points |
| Persistent | Attempt 10+ quizzes |
| Dedicated Learner | Attempt 25+ quizzes |
| Well Rounded | Attempt a quiz in every module |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- GitHub account
- Vercel account (free)
- Neon account (free)

### Local Development

```bash
git clone https://github.com/Nwigrat/ms365-academy.git
cd ms365-academy
npm install
npm run dev
```

The application will be available at http://localhost:5173. Note that API routes require deployment to Vercel or using the Vercel CLI with `vercel dev`.

### Deployment

1. Push the repository to GitHub
2. Import the project into Vercel at vercel.com
3. Connect a Neon Postgres database through the Vercel Storage tab
4. Visit `/api/setup` to create database tables
5. Visit `/api/seed` to populate default modules and questions
6. Register the first user account, which automatically becomes the administrator

### Environment Variables

| Variable | Description |
|---|---|
| DATABASE_URL | Neon PostgreSQL connection string (auto-configured via Vercel) |

---

## Default Modules

The application ships with six pre-built learning modules [1]:

1. **Microsoft Teams** — Collaboration, meetings, channels, and administration
2. **SharePoint Online** — Site management, document libraries, and permissions
3. **Outlook and Exchange Online** — Email management, calendar, and administration
4. **OneDrive for Business** — Cloud storage, syncing, and data protection
5. **M365 Security and Compliance** — Defender, Purview, DLP, and Zero Trust
6. **Power Platform Basics** — Power Automate, Power Apps, Power BI

Each module includes 15 quiz questions and 3 learning resources linked to official Microsoft documentation.

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /api/auth?action=login | POST | User login |
| /api/auth?action=register | POST | User registration |
| /api/content | GET | List all modules |
| /api/content?id={id} | GET | Get module with questions and resources |
| /api/content | POST | Create module (admin) |
| /api/content?action=questions | POST | Add question (admin) |
| /api/content?action=resources | POST | Add resource (admin) |
| /api/scores?action=submit | POST | Submit quiz score |
| /api/scores?action=leaderboard | GET | Get leaderboard |
| /api/scores?action=user-stats | GET | Get user statistics |
| /api/badges | GET | Get user badges |
| /api/badges | POST | Check and award badges |
| /api/admin?action=list-users | GET | List all users (admin) |
| /api/admin?action=analytics | GET | Get analytics data (admin) |
| /api/setup | GET | Create database tables |
| /api/seed | GET | Seed default data |

---

## Admin Guide

### First-Time Setup

After deployment, visit `/api/setup` then `/api/seed`. Register your account to become the first administrator. Navigate to the Admin tab to access user management, analytics, and the module manager.

### Creating Modules

Navigate to Admin, then Module Manager, then Create New Module. After creating the module, click Manage to add at least 15 quiz questions and relevant learning resources.

### Viewing Analytics

Navigate to Admin, then Analytics Dashboard to view KPIs, module pass rates, top performers, badge distribution, recent activity, and registration trends.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Blank screen on load | Clear localStorage in browser console and reload |
| Module not found | Verify module exists by visiting /api/content |
| Scores not on leaderboard | Ensure score submission API is being called |
| Stale data after score reset | Log out and back in to sync with database |
| No modules showing | Visit /api/seed to populate default data |
| Build exceeds function limit | Ensure api directory contains no more than 12 files |

---

## Future Roadmap

- Daily Challenge with streak-based bonus points
- CSV export for admin progress reports
- Team-based competitions and leaderboards
- Optional quiz timers with speed bonuses
- AI-powered question generation from Microsoft Learn URLs
- Microsoft Entra ID single sign-on integration

---

## Author

**Nizar Zahou**

---

## License

Private
