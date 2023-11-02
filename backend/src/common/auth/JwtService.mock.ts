import { IJwtService } from './IJwtService';

export const JwtServiceMock: IJwtService = {
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
};
