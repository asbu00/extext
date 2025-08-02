# Overview

This is a full-stack web application built with React and Express.js that appears to be a humorous "Don't Text Your Ex" app. The application uses a modern tech stack with TypeScript, React Query for state management, shadcn/ui for UI components, and Drizzle ORM for database operations. The app features an interactive interface that discourages users from contacting their ex-partners through progressively escalating responses and motivational quotes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with minimal setup
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for interactive animations and transitions

## Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API
- **Development**: tsx for running TypeScript in development mode
- **Build**: esbuild for production bundling with ESM output format
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handler with status code management

## Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect for database operations
- **Database**: PostgreSQL via Neon Database serverless connection
- **Schema**: Defined in shared directory for type safety across frontend and backend
- **Migrations**: Drizzle Kit for database schema migrations
- **Development Storage**: In-memory storage implementation for local development

## Authentication & Session Management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **User Schema**: Basic user model with username, password, and UUID primary key
- **Validation**: Zod schemas for runtime type validation and form validation

## Project Structure
- **Monorepo Setup**: Shared types and schemas between client and server
- **Client Directory**: React application with component-based architecture
- **Server Directory**: Express API with modular route handling
- **Shared Directory**: Common TypeScript types and database schemas

## Development & Build Process
- **Hot Reload**: Vite development server with HMR for frontend
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Production**: Node.js server serving built React application

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Connection Pooling**: Built-in connection management for serverless environments

## UI & Design System
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Poppins and Inter font families for typography

## Development Tools
- **Vite**: Fast build tool with plugin ecosystem
- **Replit Integration**: Runtime error overlay and cartographer plugins for Replit environment
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

## Animation & Interaction
- **Framer Motion**: Production-ready motion library for React
- **Embla Carousel**: Lightweight carousel component for interactive elements

## Form Handling & Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Hookform Resolvers**: Integration layer for validation libraries
- **Zod**: TypeScript-first schema validation library

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: URL-safe unique string ID generator
- **clsx & tailwind-merge**: Utility functions for conditional CSS classes