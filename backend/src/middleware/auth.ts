import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const payload = AuthService.verifyToken(token);
    req.userId = payload.userId;
    req.email = payload.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
