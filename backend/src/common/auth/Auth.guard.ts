import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './Jwt.service';
import { IUserRequestData } from '../models/IUserRequestData';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('JwtService')
    private readonly jwtService: JwtService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token: string = this.getAuthTokenFromHeader(context);

    if (!token) {
      return false;
    }

    try {
      request.user = this.jwtService.verifyToken<IUserRequestData>(token);
      return true;
    } catch (e) {
      return false;
    }
  }
  private getAuthTokenFromHeader(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const bearerToken: string | undefined = request.headers.authorization;

    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const [bearerString, token] = bearerToken.split(' ');

    if (!bearerString || bearerString !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
