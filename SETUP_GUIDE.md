# Quick Setup Guide

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
BASE_API_URL=https://online-car-market.onrender.com/api
NEXT_PUBLIC_BASE_API_URL=https://online-car-market.onrender.com/api
```

### What these variables do:

- **BASE_API_URL**: Used by server-side code (API routes, server components)
- **NEXT_PUBLIC_BASE_API_URL**: Used by client-side code (exposed to browser)

### For local development:

If your backend is running locally, use:

```env
BASE_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000/api
```

## 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

## 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Testing the Authentication

1. **Sign Up**: Go to `/signup` and create an account
2. **Sign In**: Go to `/signin` and login with your credentials
3. **Test Refresh**: After logging in, refresh the page - you should remain logged in
4. **Test Logout**: Click the logout button in the sidebar

## Key Files Modified

1. **`/lib/api.ts`**: Main API client with token refresh logic
2. **`/app/(auth)/signin/page.tsx`**: Updated signin page
3. **`/app/Protected.tsx`**: Enhanced protected route component
4. **`/components/Sidebar.tsx`**: Added logout functionality
5. **`/app/api/logout/route.ts`**: New logout API endpoint

## Common Issues

### Issue: "Authentication failed" error

- Make sure your backend is running
- Check that environment variables are set correctly
- Verify the API URL is correct

### Issue: Still getting logged out

- Clear browser cookies and localStorage
- Try logging in again
- Check browser console for errors

### Issue: CORS errors

- Ensure your backend allows requests from your frontend domain
- Check CORS configuration on the backend

## Next Steps

1. Test the authentication flow thoroughly
2. Check that all protected routes work correctly
3. Verify token refresh is working (wait 10 minutes and make an API call)
4. Test logout functionality

## Support

For detailed information about the authentication system, see:

- `AUTHENTICATION_IMPROVEMENTS.md` - Comprehensive documentation
- `README.md` - General project documentation
