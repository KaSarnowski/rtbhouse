import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { IJwtService } from './IJwtService';
import { JwtServiceMock } from './JwtService.mock';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from './Jwt.service';

describe('JwtService', () => {
  let mockedModule: TestingModule;
  let jwtService: IJwtService;
  process.env = {
    JWT_SECRET: 'test',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    mockedModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'JwtService',
          useClass: JwtService,
        },
      ],
    }).compile();

    jwtService = mockedModule.get('JwtService');
  });

  describe('verifyToken()', () => {
    interface ITestTokenContent {
      testContent: number;
    }

    const tokenContent: ITestTokenContent = {
      testContent: 123,
    };

    const testJwt: string = jwt.sign(tokenContent, process.env.JWT_SECRET);
    it('should return token content if verification was successful', () => {
      const result: ITestTokenContent =
        jwtService.verifyToken<ITestTokenContent>(testJwt);
      expect(result).toMatchObject(tokenContent);
    });
    it('should throw UnauthorizedException if verification was unsuccessful', () => {
      const invalidJwt: string = 'randomstring';
      expect(() =>
        jwtService.verifyToken<ITestTokenContent>(invalidJwt),
      ).toThrowError(new UnauthorizedException('Invalid token'));
    });
  });

  describe('generateToken()', () => {
    it('should return a string', () => {
      const result: string = jwtService.generateToken({});
      expect(typeof result).toEqual('string');
    });
    it('should return a valid jwt', () => {
      const result: string = jwtService.generateToken({});
      expect(() => jwt.verify(result, process.env.JWT_SECRET)).not.toThrow();
    });
  });
});
