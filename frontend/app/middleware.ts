// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key for JWT verification (use environment variable in production)
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'key';

// Middleware to verify JWT token
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Get token from cookies

  // If token is missing, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next(); // Allow the request to proceed if token is valid
  } catch (error) {
    // If token is invalid, redirect to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/protected/*'], // Apply middleware to `/protected` path
};
