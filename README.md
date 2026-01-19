# F1 Travel - F1 Race Weekend Trip Planner

A Next.js application for planning Formula 1 race weekend trips. Generate personalized itineraries with flight, hotel, ticket, and experience recommendations.

## Features

- 🔐 **Google OAuth Authentication** - Sign in with Google
- 🏎️ **2026 F1 Race Calendar** - Full season calendar with all races
- ✈️ **Trip Itinerary Generation** - Create personalized trip plans
- 💰 **Budget Tiers** - Choose from $, $$, or $$$ options
- 🔗 **Deep Links** - Direct links to flights, hotels, tickets, and experiences
- 💾 **Save Itineraries** - All trips saved to your account

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** React + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Google Provider
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd f1travel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/f1travel"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── domain/           # Pure business logic (types, validators, builders)
├── server/           # Server-side code (auth, db, repos, services)
├── ui/               # React components (presentational)
├── content/          # Static data (race calendar)
└── lib/              # Utilities and helpers
```

## Architecture

- **Domain Layer:** Pure TypeScript types and functions (no dependencies)
- **Server Layer:** Database access, repositories, and business services
- **API Layer:** Thin route handlers that delegate to services
- **UI Layer:** Presentational React components

## License

MIT
