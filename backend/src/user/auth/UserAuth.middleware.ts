import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader: string = req.header('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [bearer, token] = authHeader.split(' ');
    if (typeof token !== 'string' || bearer !== 'Bearer') {
      throw new UnauthorizedException();
    }

    if (this.isTokenValid(token)) {
      next();
      return;
    }
  }

  private isTokenValid(token: string): boolean {
    return true;
  }
}
