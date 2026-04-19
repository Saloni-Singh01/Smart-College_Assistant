# Smart College Assistant

A role-based college portal built with **React** and **Vite**. It provides separate experiences for **administrators**, **faculty**, and **students**: announcements, events, user management, quizzes, results, timetables, and a simple AI-style chatbot. Data is stored in the browser (**localStorage**) for demo purposes—there is no backend server.

## Features

| Role | Capabilities |
|------|----------------|
| **Administrator** | Dashboard, announcements, events, user management (students with roll number & password), chatbot responses, view student event registrations |
| **Faculty** | Dashboard, create/manage quizzes, results, student lists |
| **Student** | Dashboard, timetable, announcements, events, take quizzes, view results, profile, AI chatbot |

- **Authentication**: Email/password checked against stored users; session persisted locally.
- **Students**: Accounts are created by an administrator (not self-service signup). Faculty and staff can register via the signup page.
- **Events**: Students register per account; registrations appear on the admin dashboard.

## Tech stack

- [React](https://react.dev/) 19 · [React Router](https://reactrouter.com/) 7
- [Vite](https://vite.dev/) 8
- [Bootstrap](https://getbootstrap.com/) 5 & Bootstrap Icons

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (comes with Node.js)

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
git clone <your-repo-url>
cd smart-college-assistant
npm install
npm run dev
```

Open the URL shown in the terminal (usually **http://localhost:5173**).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Demo accounts

Seed users (after a fresh load with no conflicting `localStorage` data):

| Role | Email | Password |
|------|--------|----------|
| Administrator | `admin@college.edu` | `admin123` |
| Faculty | `faculty@college.edu` | `faculty123` |
| Student | `student@college.edu` | `student123` |

Additional seed users exist in the app data. New students should be added under **Admin → Manage Users** with email, password, roll number, and other details.

## Project structure (overview)

```
smart-college-assistant/
├── src/
│   ├── context/       # Global state (users, events, quizzes, etc.)
│   ├── pages/         # admin / faculty / student / auth pages
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Data & privacy

All data lives in **browser localStorage** (keys such as `sca_users`, `sca_user`, `sca_event_registrations`, `sca_quiz_submissions`). Clearing site data resets the app to seed content. **Do not use real passwords** you use elsewhere; this is a front-end demo, not a secure production system.


