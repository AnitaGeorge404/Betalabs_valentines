# 💘 Cupid's Ledger - Valentine's Matching Platform

A gamified Valentine's Day matchmaking platform designed for IIIT Kottayam students. Students take a personality quiz, and then match other students based on compatibility scores. The more accurate your matches, the higher you rank on the leaderboard!

## 🎯 Overview

Cupid's Ledger is an interactive web application that combines personality assessment with social matchmaking. Users complete a detailed questionnaire, and then play "cupid" by matching other students based on their compatibility. The system calculates match percentages based on answer similarities and rewards points for high-quality matches.

### Key Features

- 🔐 **Secure Authentication** - Google OAuth via Supabase (restricted to @iiitkottayam.ac.in emails)
- 📝 **Personality Quiz** - 20+ questions assessing preferences, values, and personality traits
- 🎯 **Smart Matching Algorithm** - Calculates compatibility based on answer differences
- 🏆 **Dual Leaderboards** - Track both top couples (most-matched pairs) and top matchers (most successful cupids)
- ⏰ **Cooldown System** - 3-minute cooldown between matches to prevent spam
- 🎲 **Batch-Based Organization** - Students organized by year and batch for better organization
- 💯 **Points System** - Earn 1-5 points based on match quality (55%-100% compatibility)
- 🎨 **Beautiful UI** - Elegant design with smooth animations using Framer Motion
- 📊 **Real-time Updates** - Live leaderboard updates with caching for performance

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.115.6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Rate Limiting**: SlowAPI
- **Language**: Python 3.8+
- **Server**: Uvicorn

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.19
- **Animations**: Framer Motion 12.31.0
- **Icons**: Lucide React
- **HTTP Client**: Supabase JS Client
- **State Management**: React Hooks

### Database
- **Platform**: Supabase
- **Type**: PostgreSQL
- **ORM**: Direct Supabase queries
- **Security**: Row Level Security (RLS) enabled

## 📂 Project Structure

```
Betalabs_valentines/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Supabase client configuration
│   ├── models.py               # Pydantic models & business logic
│   ├── requirements.txt        # Python dependencies
│   ├── schema.sql             # Database schema
│   ├── init_db.py             # Database initialization script
│   ├── seed_questions.py      # Question seeding script
│   ├── seed_test_data.sql     # Test data for development
│   ├── disable_rls.sql        # Disable RLS (dev only)
│   ├── make_nullable.sql      # Schema migration script
│   ├── migration_scaling.sql  # Performance optimization script
│   └── routes/
│       ├── users.py           # User management endpoints
│       ├── questions.py       # Quiz questions endpoints
│       └── matching.py        # Matching & leaderboard endpoints
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Main app component with routing
        ├── App.css            # Global styles
        ├── index.css          # Tailwind imports
        ├── components/
        │   ├── AuthPage.jsx        # Google OAuth login
        │   ├── OnboardingPage.jsx  # Year/Roll number collection
        │   ├── QuizPage.jsx        # Personality questionnaire
        │   ├── MatchFinder.jsx     # Match-making interface
        │   ├── Leaderboard.jsx     # Leaderboards display
        │   ├── Profile.jsx         # User profile view
        │   └── FloatingHearts.jsx  # Animated background
        └── lib/
            ├── supabase.js    # Supabase client setup
            └── api.js         # API helper functions
```

## 🗄️ Database Schema

### Tables

#### `users`
```sql
email TEXT PRIMARY KEY                 -- User email (must end with @iiitkottayam.ac.in)
name TEXT NOT NULL                     -- Full name
year INTEGER                           -- Academic year (2023, 2024, 2025)
rollno INTEGER                         -- Roll number
gender TEXT                            -- "male" or "female"
preference TEXT                        -- "men" or "women"
answers JSONB                          -- Quiz answers: {"qid": score}
score FLOAT DEFAULT 0.0                -- Total points earned as a matcher
created_at TIMESTAMPTZ DEFAULT NOW()
```

**Batch Calculation**:
- Year 2023: 2 batches (rollno % 2 → Batch 1 or 2)
- Year 2024/2025: 4 batches (rollno % 4 → Batch 1, 2, 3, or 4)

#### `questions`
```sql
qid INTEGER PRIMARY KEY                -- Question ID
question TEXT NOT NULL                 -- Question text
weightage FLOAT DEFAULT 1.0            -- Question importance (currently unused)
```

#### `scores`
```sql
id SERIAL PRIMARY KEY
person1 TEXT REFERENCES users(email)
person2 TEXT REFERENCES users(email)
number_of_times_matched INTEGER        -- How many times this pair was matched
score FLOAT                            -- Average compatibility percentage
matched_by JSONB                       -- Array of matchers' emails
created_at TIMESTAMPTZ DEFAULT NOW()
UNIQUE(person1, person2)
```

## 🔌 API Endpoints

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register or retrieve user |
| GET | `/users/check?email=...` | Check if user is onboarded |
| POST | `/users/onboard` | Save year/rollno during onboarding |
| GET | `/users/search?q=...` | Search users by name/email |

### Questions (`/questions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions/` | Get all quiz questions |
| GET | `/questions/{qid}` | Get specific question |

### Matching (`/match`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/match/make` | Create a match between two people |
| POST | `/match/submit` | Submit quiz answers |
| GET | `/match/leaderboard/couples?limit=20` | Top matched couples |
| GET | `/match/leaderboard/users?limit=20` | Top matchers by score |
| GET | `/match/cooldown?email=...` | Check cooldown status |

### Rate Limiting
- **Match endpoint**: 10 requests/minute per IP
- **Cooldown period**: 3 minutes between matches per user

## 🧮 Matching Algorithm

### Compatibility Calculation

1. **Per-Question Match**:
   ```
   difference = |person1_answer - person2_answer|
   question_match_% = ((10 - difference) / 10) × 100
   ```

2. **Overall Match**:
   ```
   match_% = average(all question_match_%)
   ```

3. **Preference Penalty**:
   - If both users have the same preference (both like men OR both like women): **-7% penalty**
   - Different preferences (assumed straight pair): **no penalty**

### Points System

| Match % | Points Earned |
|---------|---------------|
| 95-100% | 5 points |
| 85-94%  | 4 points |
| 75-84%  | 3 points |
| 65-74%  | 2 points |
| 55-64%  | 1 point |
| < 55%   | 0 points |

Points are awarded to the matcher (the user who made the match), not the matched couple.

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file**:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-public-key
   ```

5. **Setup database**:
   - Go to your Supabase project → SQL Editor
   - Run the SQL in `schema.sql`
   - Run `python seed_questions.py` to populate questions

6. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```
   API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5173`

## 🔧 Environment Variables

### Backend (`.env`)
```env
SUPABASE_URL=         # Your Supabase project URL
SUPABASE_KEY=         # Your Supabase anon/public key
```

### Frontend (`.env`)
```env
VITE_SUPABASE_URL=         # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Your Supabase anon/public key
```

## 🎮 User Flow

1. **Authentication** → User logs in with Google (@iiitkottayam.ac.in email only)
2. **Onboarding** → User enters year and roll number (batch auto-calculated)
3. **Gender & Preference** → User selects their gender and romantic preference
4. **Quiz** → User answers 20+ questions on a 0-10 scale
5. **Match Making** → User searches for students and matches pairs
6. **Leaderboard** → View top couples and top matchers

## 🎨 Design System

### Color Palette
- **Deep Crimson**: Primary brand color (#8B0000)
- **Soft Red**: Accent color (#FF6B7A)
- **Charcoal**: Text color (#2C2C2C)
- **Neo White**: Background (#F8F9FA)
- **Blush Pink**: Highlights (#FFE5E5)

### Typography
- **Headings**: Serif fonts for elegance
- **Body**: Sans-serif for readability

### UI Features
- Neomorphic design elements
- Floating heart animations
- Smooth page transitions
- Responsive design (mobile-first)

## 🔒 Security Features

- **Email Validation**: Only @iiitkottayam.ac.in emails allowed
- **Row Level Security**: Enabled on all Supabase tables
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for security
- **Cooldown System**: Prevents spam matching

## 📊 Performance Optimizations

- **Leaderboard Caching**: 5-minute TTL to reduce database load
- **Debounced Search**: 400ms delay on user search
- **RPC Functions**: Single-query matches for efficiency
- **Indexed Queries**: Fast leaderboard retrieval

## 🐛 Development Tools

### Database Scripts
- `init_db.py` - Initialize database tables
- `seed_questions.py` - Populate quiz questions
- `seed_test_data.sql` - Generate test users and matches
- `disable_rls.sql` - Disable RLS for development
- `migration_scaling.sql` - Performance optimizations

### Build Commands

**Frontend**:
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend**:
```bash
uvicorn main:app --reload           # Development
uvicorn main:app --host 0.0.0.0    # Production
```

## 📈 Future Enhancements

- [ ] Real-time notifications for matches
- [ ] Chat functionality between matched pairs
- [ ] Advanced filtering (by year, batch, gender)
- [ ] Match history and analytics
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] AI-powered match suggestions
- [ ] Weighted question importance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for IIIT Kottayam's Valentine's Day event. All rights reserved.

## 👥 Authors

Built with ❤️ for the IIIT Kottayam community.

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Happy Matching! 💘**
