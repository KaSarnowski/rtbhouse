export interface IJwtService {
  verifyToken<TokenContent extends object>(token: string): TokenContent;
  generateToken<TokenContent extends object>(payload: TokenContent): string;
}
