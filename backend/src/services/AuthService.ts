import jwt from 'jwt-simple';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { JWTPayload } from '../types/index.js';
import { formatDbError } from '../utils/errorFormatter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  // In-memory fallback store for testing when MongoDB is not available
  private static inMemoryUsers: Map<string, { id: string; email: string; password: string }> = new Map();

  static async register(email: string, password: string) {
    // If MongoDB is connected, use it; otherwise use in-memory store
    const mongooseConn = (await import('mongoose')).connection;
    if (mongooseConn && mongooseConn.readyState === 1) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        email,
        password: hashedPassword,
      });

      try {
        await user.save();
      } catch (err: any) {
        throw new Error(formatDbError(err));
      }

      const token = this.generateToken(user._id.toString(), email);
      return { token, userId: user._id };
    }

    // In-memory path
    if (this.inMemoryUsers.has(email)) {
      throw new Error('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    this.inMemoryUsers.set(email, { id, email, password: hashedPassword });
    const token = this.generateToken(id, email);
    return { token, userId: id };
  }

  static async login(email: string, password: string) {
    const mongooseConn = (await import('mongoose')).connection;
    if (mongooseConn && mongooseConn.readyState === 1) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user._id.toString(), email);
      return { token, userId: user._id };
    }

    // In-memory login
    const record = this.inMemoryUsers.get(email);
    if (!record) throw new Error('Invalid credentials');
    const passwordMatch = await bcrypt.compare(password, record.password);
    if (!passwordMatch) throw new Error('Invalid credentials');
    const token = this.generateToken(record.id, email);
    return { token, userId: record.id };
  }

  static generateToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };
    return jwt.encode(payload, JWT_SECRET);
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.decode(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
