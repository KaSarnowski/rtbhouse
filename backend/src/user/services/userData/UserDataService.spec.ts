import { Test, TestingModule } from '@nestjs/testing';
import { IUserDataService } from './IUserDataService';
import { UserDataService } from './UserData.service';
import { RandomDataServiceMock } from '../../../externalData/services/randomData/RandomDataService.mock';
import {
  IRandomDataService,
  IRandomUserData,
} from '../../../externalData/services/randomData/IRandomDataService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../common/entities/User';
import { UserRepositoryMock } from '../../../common/entities/mockRepositories/UserRepository.mock';
import { Repository } from 'typeorm';

describe('UserDataService', () => {
  let mockedModule: TestingModule;
  let userDataService: IUserDataService;
  let randomDataService: IRandomDataService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockedModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'RandomDataService',
          useValue: { ...RandomDataServiceMock },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { ...UserRepositoryMock },
        },
        {
          provide: 'UserDataService',
          useClass: UserDataService,
        },
      ],
    }).compile();

    userDataService = mockedModule.get('UserDataService');
    randomDataService = mockedModule.get('RandomDataService');
    userRepository = mockedModule.get(getRepositoryToken(User));
  });

  describe('getNewUserData()', () => {
    const randomUserData: IRandomUserData = {
      firstName: 'Test First Name',
      lastName: 'Test Last Name',
      username: 'Test Username',
      email: 'example@email.com',
      avatarUrl: 'https://test.test/test.png',
    };
    const randomUserInDb: User = {
      id: 1,
      firstName: randomUserData.firstName,
      lastName: randomUserData.lastName,
      username: randomUserData.username,
      email: randomUserData.email,
      avatar: randomUserData.avatarUrl,
      isAvatarSeen: false,
      deletedAt: null,
    } as User;

    it('should fetch a random user from randomDataService', async () => {
      jest
        .spyOn(randomDataService, 'getRandomUserData')
        .mockResolvedValue(randomUserData);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(randomUserInDb);

      await userDataService.getNewUserData();
      expect(RandomDataServiceMock.getRandomUserData).toBeCalledTimes(1);
    });

    it('should create a new user in the database', async () => {
      jest
        .spyOn(randomDataService, 'getRandomUserData')
        .mockResolvedValue(randomUserData);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(randomUserInDb);

      await userDataService.getNewUserData();
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it('should return the newly created user', async () => {
      jest
        .spyOn(randomDataService, 'getRandomUserData')
        .mockResolvedValue(randomUserData);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(randomUserInDb);

      const result = await userDataService.getNewUserData();
      expect(result).toStrictEqual({
        id: randomUserInDb.id,
        isAvatarSeen: randomUserInDb.isAvatarSeen,
        avatarUrl: randomUserData.avatarUrl,
      });
    });
  });

  describe('setAvatarSeen()', () => {
    it('should call the repository with correct parameters', async () => {
      await userDataService.setAvatarSeen(1);
      expect(userRepository.update).toBeCalledWith(1, {
        isAvatarSeen: true,
      });
    });
  });

  describe('getUserStats()', () => {
    it('should fetch all non-deleted users from the database', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);
      await userDataService.getUserStats();
      expect(userRepository.find).toBeCalledWith({ withDeleted: false });
    });
    it('should return the correct stats', async () => {
      const users: User[] = [
        {
          id: 1,
          firstName: 'Test First Name',
          lastName: 'Test Last Name',
          username: 'Test Username',
          email: 'example@email.com',
          avatar: 'https://test.test/test.png',
          isAvatarSeen: true,
          deletedAt: null,
        } as User,
        {
          id: 2,
          firstName: 'Test First Name2',
          lastName: 'Test Last Name2',
          username: 'Test Username2',
          email: 'example2@email.com',
          avatar: 'https://test.test/test2.png',
          isAvatarSeen: false,
          deletedAt: null,
        } as User,
        {
          id: 3,
          firstName: 'Test First Name3',
          lastName: 'Test Last Name3',
          username: 'Test Usernam3e',
          email: 'example3@email.com',
          avatar: 'https://test.test/test.png3',
          isAvatarSeen: true,
          deletedAt: null,
        } as User,
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);
      const result = await userDataService.getUserStats();
      expect(result).toStrictEqual({
        totalUsers: 3,
        percentageAvatarsSeen: 67,
      });
    });
  });
});
