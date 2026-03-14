/**
 * Centralized backend API configuration.
 * Set NEXT_PUBLIC_BASE_API_URL or BASE_API_URL in .env (e.g. https://api.example.com/api).
 */
export const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  process.env.BASE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://online-car-market.onrender.com/api";
