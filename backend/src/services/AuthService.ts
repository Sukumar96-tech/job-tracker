import jwt from 'jwt-simple';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { JWTPayload } from '../types/index.js';
import { formatDbError } from '../utils/errorFormatter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {

  // ✅ REGISTER USER (MongoDB only)
  static async register(email: string, password: string) {
    try {
      console.log("🔥 Register called:", email);

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        email,
        password: hashedPassword,
      });

      await user.save(); // 🔥 VERY IMPORTANT

      console.log("✅ User saved:", user);

      const token = this.generateToken(user._id.toString(), email);

      return { token, userId: user._id };

    } catch (err: any) {
      console.error("❌ Register error:", err);
      throw new Error(formatDbError(err));
    }
  }

  // ✅ LOGIN USER (MongoDB only)
  static async login(email: string, password: string) {
    try {
      console.log("🔐 Login called:", email);

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

    } catch (err: any) {
      console.error("❌ Login error:", err);
      throw new Error(err.message);
    }
  }

  // ✅ GENERATE TOKEN
  static generateToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };

    return jwt.encode(payload, JWT_SECRET);
  }

  // ✅ VERIFY TOKEN
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.decode(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}