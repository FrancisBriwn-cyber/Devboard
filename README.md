DevBoard 🧑‍💻
> A full-stack Developer Productivity Dashboard for developers actively searching for jobs.
DevBoard centralizes everything you need during a job search — track applications, discover live remote opportunities, stay updated with developer news, and explore GitHub profiles — all in one clean, modern dashboard.
---
🚀 Live Demo
Coming Soon
---
📸 Screenshots
> *(Add screenshots here — dashboard overview, job tracker, job listings, news feed)*
---
🛠 Tech Stack
Layer	Technology
Frontend	React 18, TypeScript, Vite
Styling	Tailwind CSS
State Management	Zustand
Auth + Database	Supabase (Auth + PostgreSQL)
Routing	React Router v6
HTTP Client	Axios
Testing	Jest, React Testing Library
APIs	Remotive API, DEV.to API, GitHub API
---
✨ Features
🔐 Authentication
Secure register and login powered by Supabase
Users pick a personalized avatar on registration
Sessions persist across browser refreshes
📋 Job Application Tracker
Add, edit, and delete job applications
Track company name, role, status, date applied, job URL, and notes
Status stages: Applied → Interview → Offer → Rejected
All data stored in real PostgreSQL and synced in real time
💼 Live Job Listings
Browse real remote job opportunities from the Remotive API
Filter by category: Software Dev, Design, Marketing, Product, Data
Search by job title or company name
📰 Developer News Feed
Latest developer articles fetched live from DEV.to
Filter by tag: React, JavaScript, TypeScript, CSS, Node, and more
Each article links directly to the full post
🔍 GitHub Explorer
Search any GitHub username
View profile info, follower stats, and top repositories
Language indicators and star counts per repo
📊 Dashboard Overview
Live stats: total applications, interviews, offers, and rejections
All pulled dynamically from your personal tracker data
🧭 Navigation
Sticky navbar with active route highlighting
Seamless navigation across all pages
---
⚙️ How to Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/FrancisBriwn-cyber/devboard.git

# 2. Navigate into the project
cd devboard

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials in .env

# 5. Start the development server
npm run dev
```
---
🔑 Environment Variables
Create a `.env` file in the root of the project with the following:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
> You can get these from your [Supabase project dashboard](https://supabase.com).
---
🗂 Project Structure
```
devboard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── store/            # Zustand state management
│   ├── lib/              # Supabase client & API helpers
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # App entry point
├── public/
├── .env.example
├── index.html
└── vite.config.ts
```
---
🧪 Running Tests
```bash
npm run test
```
Tests are written with Jest and React Testing Library.
---
🚢 Deployment
This project is deployed on Vercel (or Netlify — update as needed).
To deploy your own instance:
Push the repo to GitHub
Import the project on Vercel
Add your environment variables in the Vercel dashboard
Deploy
---
📬 Contact
Built by Ani | Francis Aniefiok Brown
GitHub: @FrancisBriwn-cyber
Instagram: @francisbriwn
Facebook: Aniefiok Brown
X.com: @_AniBrown
---
> ⭐ If you found this project useful or interesting, consider giving it a star!