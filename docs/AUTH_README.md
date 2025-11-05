# Authentication Implementation

This project includes a complete authentication system with login and protected dashboard pages.

## Features

- ✅ Login page with TanStack Form and Zod validation
- ✅ Protected dashboard page
- ✅ Authentication context and hooks
- ✅ TanStack Query for data fetching
- ✅ Next.js middleware for route protection
- ✅ Shadcn UI components

## Structure

### Pages
- `/` - Home page (redirects to login or dashboard based on auth state)
- `/login` - Login page with form validation
- `/dashboard` - Protected dashboard page (requires authentication)

### Key Files

#### Authentication
- `lib/auth-context.tsx` - Auth context provider and useAuth hook
- `middleware.ts` - Next.js middleware for route protection

#### API & Data Fetching
- `lib/query-client.ts` - TanStack Query client configuration
- `lib/query-provider.tsx` - Query provider wrapper

#### Pages
- `app/login/page.tsx` - Login form with TanStack Form and Zod validation
- `app/dashboard/page.tsx` - Protected dashboard with TanStack Query example

## Usage

### Running the App

```bash
pnpm dev
```

Visit `http://localhost:3000` and you'll be redirected to the login page.

### Login

Enter any email and password (6+ characters) to login. The current implementation uses mock authentication.

Example credentials:
- Email: `test@example.com`
- Password: `password123`

### Dashboard

After login, you'll be redirected to `/dashboard` where you can see:
- User information
- Mock statistics
- Logout functionality

## Authentication Flow

1. **Login**: User submits credentials via the login form
2. **Token Storage**: Auth token is stored in localStorage and cookies
3. **Middleware Check**: Middleware validates the token cookie for protected routes
4. **Client-side Check**: Auth context checks authentication state
5. **Logout**: Clears tokens and redirects to login

## Integration with Real API

To integrate with a real backend API:

1. Update `lib/auth-context.tsx`:
   - Replace the mock login function with your actual API call
   - Update the User interface to match your user model
   - Implement proper token refresh logic

2. Update `app/dashboard/page.tsx`:
   - Replace `fetchDashboardData` with your actual API endpoints
   - Use TanStack Query for data fetching

3. Update `middleware.ts`:
   - Add token validation logic if needed
   - Implement proper JWT verification

## Technologies Used

- **Next.js 16** (App Router)
- **TanStack Form** - Form state management
- **TanStack Query** - Server state management
- **Zod** - Schema validation
- **Shadcn UI** - Component library
- **TypeScript** - Type safety

## Notes

- The current implementation uses mock authentication for demonstration
- Tokens are stored in both localStorage (for client-side) and cookies (for middleware)
- Protected routes are handled both by middleware and client-side checks
- The middleware redirects unauthenticated users to the login page
