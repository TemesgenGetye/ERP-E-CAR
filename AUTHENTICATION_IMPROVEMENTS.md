# Authentication System Improvements

## Problem

Users were being logged out when refreshing the page, causing a poor user experience and losing their session state.

## Solution

Implemented a robust JWT token refresh system that:

1. Automatically refreshes tokens before they expire
2. Handles 401 errors gracefully by refreshing and retrying
3. Prevents multiple simultaneous refresh attempts
4. Maintains session state across page refreshes
5. Uses localStorage to track token refresh timing

## Changes Made

### 1. Enhanced API Client (`/lib/api.ts`)

Created a comprehensive API client with the following features:

#### Token Refresh Strategy

- **Proactive Refresh**: Tokens are automatically refreshed every 10 minutes
- **Reactive Refresh**: On 401 errors, tokens are refreshed and the request is retried
- **Token Validation**: Checks if tokens are expired or expiring within 5 minutes
- **Concurrent Request Handling**: Prevents multiple simultaneous refresh attempts

#### Key Functions

##### `api<T>(path, opts)`

Main API client function that handles all API calls with automatic token refresh.

```typescript
// Basic usage
const data = await api<User>("/users/1");

// POST with body
const result = await api<Response>("/endpoint", {
  method: "POST",
  body: { name: "John" },
});

// FormData upload
const formData = new FormData();
formData.append("file", file);
await api("/upload", {
  method: "POST",
  body: formData,
});
```

##### `initializeAuthState(user?)`

Initializes the auth state in localStorage after successful login. Tracks:

- Last refresh timestamp
- User information

##### `clearAuthState()`

Clears all auth-related data from localStorage. Called on logout or auth errors.

#### How Token Refresh Works

1. **Before Each Request**:

   - Check if 10+ minutes have passed since last refresh
   - If yes, proactively refresh tokens via `/api/me`
   - Update localStorage with new timestamp

2. **On 401 Response**:

   - Attempt to refresh tokens via `/api/me`
   - If successful, retry the original request with new token
   - If failed, clear auth state and redirect to signin

3. **Concurrent Requests**:
   - If multiple requests trigger refresh simultaneously
   - Only one refresh is performed
   - Other requests wait for the refresh to complete

### 2. Updated Signin Page (`/app/(auth)/signin/page.tsx`)

- Added `initializeAuthState()` call after successful login
- This ensures the auth state is tracked from the moment the user logs in

```typescript
const user = await signin(data);
setUser(user.user);
initializeAuthState(user.user); // Track auth state
router.push("/");
```

### 3. Enhanced Protected Component (`/app/Protected.tsx`)

- Added `initializeAuthState()` call after successful token refresh
- Added `clearAuthState()` call on errors
- Better error handling and redirect logic

```typescript
// On successful refresh
setUser(data.user);
initializeAuthState(data.user);

// On error
clearAuthState();
router.push("/signin");
```

### 4. Logout Functionality

#### New Logout API Route (`/app/api/logout/route.ts`)

- Deletes httpOnly cookies (`access` and `refresh`)
- Returns success response

#### Updated Sidebar Component (`/components/Sidebar.tsx`)

- Added `handleLogout()` function
- Clears server-side cookies via API call
- Clears client-side auth state
- Clears user store
- Redirects to signin page

```typescript
const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  clearAuthState();
  clearUser();
  router.push("/signin");
};
```

### 5. Documentation Updates

- Updated `README.md` with comprehensive authentication documentation
- Added usage examples for the API client
- Documented security features
- Added setup instructions

## Technical Details

### Token Storage

- **Server-side**: Access and refresh tokens stored in httpOnly cookies
  - `access`: 15-minute expiration
  - `refresh`: 30-day expiration
- **Client-side**: localStorage tracks:
  - Last refresh timestamp
  - User information (for quick access)

### Security Features

1. **HttpOnly Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
2. **Secure Flag**: Ensures cookies only sent over HTTPS in production
3. **SameSite Strict**: Prevents CSRF attacks
4. **Token Expiration**: JWT tokens have built-in expiration
5. **Automatic Cleanup**: Auth state cleared on errors or logout

### How It Prevents Logout on Refresh

1. **Page Refresh**:

   - Protected component calls `/api/me`
   - Server uses refresh token from httpOnly cookie
   - New tokens generated and set in cookies
   - User data fetched and stored
   - `initializeAuthState()` tracks the refresh

2. **Subsequent API Calls**:

   - Check localStorage for last refresh time
   - If 10+ minutes passed, proactively refresh
   - Cookies automatically included in requests
   - 401 errors trigger automatic refresh and retry

3. **Session Persistence**:
   - Refresh token valid for 30 days
   - Regular API calls keep the session active
   - User stays logged in until they explicitly logout or 30 days pass

## Environment Setup

Create a `.env.local` file:

```env
BASE_API_URL=https://online-car-market.onrender.com/api
NEXT_PUBLIC_BASE_API_URL=https://online-car-market.onrender.com/api
```

- `BASE_API_URL`: Used by server-side code
- `NEXT_PUBLIC_BASE_API_URL`: Used by client-side code

## Testing the Implementation

### Test Scenarios

1. **Login and Refresh**:

   - Login to the application
   - Refresh the page
   - ✅ User should remain logged in
   - ✅ User data should be preserved

2. **Token Expiration**:

   - Login and wait 10 minutes
   - Make an API call
   - ✅ Token should refresh automatically
   - ✅ Request should succeed

3. **Multiple Tabs**:

   - Open multiple tabs
   - Make simultaneous API calls
   - ✅ Only one refresh should occur
   - ✅ All requests should succeed

4. **Logout**:

   - Click the logout button
   - ✅ Should redirect to signin
   - ✅ Auth state should be cleared
   - ✅ Cookies should be deleted

5. **Expired Refresh Token**:
   - Wait 30 days (or simulate expired token)
   - Try to make an API call
   - ✅ Should redirect to signin
   - ✅ Error message should be clear

## Migration Guide

If you have existing API calls using `fetch` directly, migrate them to use the new `api` client:

### Before

```typescript
const res = await fetch(`${API_URL}/endpoint`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
const result = await res.json();
```

### After

```typescript
import { api } from "@/lib/api";

const result = await api("/endpoint", {
  method: "POST",
  body: data,
});
```

Benefits:

- Automatic token refresh
- Automatic retry on 401
- Less boilerplate code
- Centralized error handling
- Type safety with generics

## Future Enhancements

Potential improvements for the future:

1. **Refresh Token Rotation**: Implement refresh token rotation for enhanced security
2. **Token Blacklisting**: Add server-side token blacklist for revoked tokens
3. **Activity Tracking**: Track user activity and extend sessions automatically
4. **Multi-device Support**: Allow users to see and manage sessions from different devices
5. **Remember Me**: Add option to extend session duration
6. **Session Timeout Warning**: Warn users before session expires
7. **Biometric Authentication**: Add fingerprint/face recognition for mobile

## Troubleshooting

### Issue: Still getting logged out on refresh

**Solution**:

- Check if cookies are being set properly (inspect browser DevTools → Application → Cookies)
- Ensure `BASE_API_URL` environment variable is set
- Check if `/api/me` endpoint is working correctly

### Issue: Token refresh fails

**Solution**:

- Check if refresh token is expired (30 days)
- Verify `/api/me` endpoint is accessible
- Check server logs for errors
- Ensure refresh token cookie is being sent

### Issue: Multiple refresh attempts

**Solution**:

- This should be prevented by the concurrent request handling
- Check browser console for errors
- Ensure only one instance of the app is running

## Support

For issues or questions:

1. Check the browser console for errors
2. Check server logs for API errors
3. Verify environment variables are set
4. Test with a fresh login

## Conclusion

The improved authentication system provides:

- ✅ Persistent sessions across page refreshes
- ✅ Automatic token refresh
- ✅ Better error handling
- ✅ Enhanced security
- ✅ Improved user experience
- ✅ Cleaner API interface

Users will no longer be logged out when refreshing the page, providing a seamless experience throughout the application.
