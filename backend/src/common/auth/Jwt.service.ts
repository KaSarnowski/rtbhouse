import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { IUserRequestData } from '../models/IUserRequestData';

export class JwtService {
  generateToken(payload: IUserRequestData): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  verifyToken(token: string): IUserRequestData {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
