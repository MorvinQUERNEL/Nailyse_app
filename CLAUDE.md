# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nailyse is a full-stack nail salon management application with an e-commerce shop and appointment booking system. It uses a React 19 frontend with Vite, and a Symfony 7.4 backend with API Platform.

## Development Commands

### Backend (Symfony)
```bash
cd backend

# Start development server
symfony server:start                    # Recommended
php -S 127.0.0.1:8000 -t public        # Alternative

# Database management
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load

# Clear cache
php bin/console cache:clear

# Create new entity
php bin/console make:entity

# Create migration after entity changes
php bin/console make:migration
```

### Frontend (React + Vite)
```bash
cd frontend

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm preview
```

## Architecture & Key Concepts

### Backend Architecture

**API Platform Auto-generation**: Entities annotated with `#[ApiResource]` automatically generate full REST APIs. The two main entities are:
- `Product` (id, name, description, price, imageUrl)
- `Appointment` (id, clientName, clientEmail, clientPhone, startAt, status)

**Custom Controller**: `PaymentController` handles Stripe checkout session creation at `/api/payment/create-session`. It includes a mock mode for development when Stripe keys are not configured (checks if key starts with `sk_test_***`).

**Database**: Uses SQLite by default (`var/data.db`). Connection string in `.env` as `DATABASE_URL`.

**CORS**: Configured via Nelmio CORS bundle to allow localhost origins for development.

### Frontend Architecture

**Global State Management**:
- `CartContext` - Manages shopping cart with localStorage persistence (key: `nailyse_cart`)
- `ThemeContext` - Manages dark/light theme with localStorage persistence (key: `theme`)

**Cart Behavior**:
- Cart automatically opens when items are added (`setIsOpen(true)` in `addToCart`)
- Cart persists across browser sessions via localStorage
- Quantities cannot go below 1

**Routing**: Uses React Router 7 with pages in `src/pages/`:
- Home, Shop, Appointments, Checkout, PaymentSuccess, PaymentCancel

**API Communication**:
- Base URL defined in `frontend/.env` as `VITE_API_URL=http://127.0.0.1:8000`
- All API calls should use this environment variable

**Styling**: Tailwind CSS with dark mode support via `class` strategy (adds/removes `dark` class on document root)

### Payment Flow

1. Frontend sends cart items to `/api/payment/create-session`
2. Backend creates Stripe session with line items (prices in cents: `price * 100`)
3. Backend returns Stripe checkout URL
4. User redirected to Stripe, then back to success/cancel pages
5. Success URL: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`
6. Cancel URL: `http://localhost:5173/payment/cancel`

### Appointment System

- Only weekends are bookable (Saturday/Sunday)
- Time slots: 10h-18h
- Appointments have three statuses: `PENDING`, `CONFIRMED`, `CANCELLED`
- Email and phone validation enforced at entity level
- Uses `DateTimeImmutable` to prevent accidental date modifications

## Environment Variables

### Backend (`backend/.env`)
- `APP_ENV=dev`
- `APP_SECRET` - Already configured
- `DATABASE_URL` - Currently SQLite, can switch to PostgreSQL for production
- `STRIPE_SECRET_KEY` - Set to `sk_test_***` placeholder (needs real key for payments)
- `CORS_ALLOW_ORIGIN` - Configured for localhost

### Frontend (`frontend/.env`)
- `VITE_API_URL=http://127.0.0.1:8000` - Backend API base URL

## Common Development Patterns

When adding new products via fixtures, use the pattern in `DataFixtures`:
- Products should have name, description, price, and imageUrl
- Images can be external URLs or paths

When modifying entities:
1. Update the entity class
2. Run `php bin/console make:migration`
3. Run `php bin/console doctrine:migrations:migrate`

When adding API endpoints beyond API Platform auto-generation:
- Use custom controllers like `PaymentController`
- Register routes via attributes `#[Route('/api/...')]`

## Testing Stripe Integration

Without a real Stripe key, the backend returns a mock success URL. To test with real Stripe:
1. Get test key from https://stripe.com (starts with `sk_test_`)
2. Update `STRIPE_SECRET_KEY` in `backend/.env`
3. Restart backend server
