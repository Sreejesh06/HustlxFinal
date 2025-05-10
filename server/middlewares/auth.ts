import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWT Secret (should be in env vars in production)
const JWT_SECRET = process.env.JWT_SECRET || "empowerher-jwt-secret";

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: "homemaker" | "customer";
      };
    }
  }
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth for certain routes
  if (
    req.path === "/api/auth/login" ||
    req.path === "/api/auth/register" ||
    !req.path.startsWith("/api/")
  ) {
    return next();
  }
  
  const tokenHeader = req.headers.authorization;
  
  if (!tokenHeader) {
    // Token not required for GET public data
    if (req.method === "GET" && (
      req.path.startsWith("/api/listings") ||
      req.path.startsWith("/api/users") ||
      req.path.startsWith("/api/reviews") ||
      req.path.startsWith("/api/media") ||
      req.path.startsWith("/api/homemakers")
    )) {
      return next();
    }
    return next();
  }
  
  // Extract token (remove "Bearer " prefix)
  const token = tokenHeader.split(" ")[1];
  
  if (!token) {
    return next();
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: "homemaker" | "customer";
    };
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // Invalid token, but continue (will be handled by requireAuth if needed)
    next();
  }
};

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Middleware to require specific role
export const requireRole = (role: "homemaker" | "customer") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({ message: `This action requires ${role} role` });
    }
    
    next();
  };
};
