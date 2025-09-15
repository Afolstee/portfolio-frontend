# Overview

This is a portfolio frontend application built with Next.js 15 and React 19. The project serves as a personal portfolio website showcasing projects, skills, and contact information. It features a modern, responsive design with animations powered by Framer Motion and styled with Tailwind CSS. The application includes project galleries, skill displays, contact forms, and integrates with a backend API for dynamic content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Framework
- **Next.js 15 with App Router**: Modern React framework providing server-side rendering, static site generation, and API routes
- **React 19**: Latest React version with concurrent features and improved performance
- **TypeScript**: Type-safe development with strict compiler options

## Styling and UI
- **Tailwind CSS v4**: Utility-first CSS framework with PostCSS integration for modern styling
- **Framer Motion**: Animation library for smooth transitions and interactive elements
- **Lucide React**: Icon library providing consistent iconography
- **Custom CSS Variables**: Theme system supporting light/dark mode switching

## Data Fetching and State Management
- **SWR**: React hooks library for data fetching with caching, revalidation, and error handling
- **Axios**: HTTP client for API communication with the backend
- **Client-side State**: React hooks for local component state management

## Build and Development
- **TypeScript Configuration**: Strict type checking with path mapping for clean imports (@/* aliases)
- **ESLint**: Code linting with Next.js specific rules
- **Next.js Configuration**: Optimized for static export with trailing slashes and unoptimized images

## Deployment Architecture
- **Vercel Platform**: Serverless deployment with automatic builds and global CDN
- **Static Export**: Application configured for static site generation
- **Environment Variables**: API URL configuration through Vercel environment variables

# External Dependencies

## Backend API Integration
- **Portfolio API**: External backend service hosted at `https://portfolio-3z3s.onrender.com`
- **REST API**: Fetches projects, skills, analytics, and handles contact form submissions
- **Real-time Data**: SWR provides automatic revalidation for fresh content

## Third-party Services
- **Vercel**: Hosting platform with serverless functions and global CDN
- **Google Fonts**: Geist and Geist Mono font families for typography
- **GitHub Integration**: Project links and repository connections

## Development Tools
- **Node.js Ecosystem**: NPM package management with lock file for dependency consistency
- **TypeScript Compiler**: Type checking and modern JavaScript transpilation
- **PostCSS**: CSS processing for Tailwind CSS compilation

## API Endpoints Structure
Based on the portfolio component, the application integrates with several API endpoints:
- Projects endpoint for portfolio items
- Skills endpoint for technical capabilities
- Analytics endpoint for usage tracking
- Contact endpoint for form submissions