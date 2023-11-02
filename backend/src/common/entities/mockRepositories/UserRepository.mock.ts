import { User } from '../User';
import { Repository } from 'typeorm';

export const UserRepositoryMock: Repository<User> = {
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
} as unknown as Repository<User>;
