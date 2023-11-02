import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { IJwtService } from './IJwtService';
import { UnauthorizedException } from '@nestjs/common';
export class JwtService implements IJwtService {
  generateToken<TokenContent extends object>(payload: TokenContent): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  verifyToken<TokenContent extends object>(token: string): TokenContent {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
