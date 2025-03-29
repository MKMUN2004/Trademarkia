
# Trademarkia Frontend Intern Task Application

A full-stack web application built with React, Express, and TypeScript, featuring a modern UI with Tailwind CSS and Shadcn components.

## Features

- 🚀 Full-stack TypeScript setup
- ⚡️ Vite for blazing fast development
- 🎨 Tailwind CSS for styling
- 🧩 Shadcn UI components
- 🔒 Session-based authentication
- 📊 PostgreSQL database with Drizzle ORM
- 🔄 React Query for data fetching
- 🎯 End-to-end type safety

## Development

This project is developed on Replit, making it easy to get started:

1. Fork the Repl
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at port 5000.

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and utilities
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema changes

## Environment Variables

Configure your environment variables in the Replit Secrets tab:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session management

## Deployment

Deploy directly from Replit using the Deploy tab. The application is configured for production deployment with automatic scaling.

## License

MIT
