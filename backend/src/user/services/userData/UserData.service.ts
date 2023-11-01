import { IUserData, IUserDataService, IUserStats } from './IUserDataService';
import {
  IRandomDataService,
  IRandomUserData,
} from '../../../externalData/services/randomData/IRandomDataService';
import { Inject } from '@nestjs/common';
import { User } from '../../../common/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as math from 'mathjs';

export class UserDataService implements IUserDataService {
  constructor(
    @Inject('RandomDataService')
    private readonly _randomDataService: IRandomDataService,

    @InjectRepository(User)
    private _usersRepository: Repository<User>,
  ) {}

  public async getNewUserData(): Promise<IUserData> {
    const randomUserData: IRandomUserData = await this.getRandomUser();
    return this.createNewInternalUser(randomUserData);
  }

  public async setAvatarSeen(userId: number): Promise<void> {
    await this._usersRepository.update(userId, { isAvatarSeen: true });
  }

  public async getUserStats(): Promise<IUserStats> {
    const users: User[] = await this._usersRepository.find({
      withDeleted: false,
    });
    const totalUsersCount: number = users.length;
    const totalUsersWithSeenAvatarCount: number = users.filter(
      (user) => user.isAvatarSeen,
    ).length;

    return {
      totalUsers: totalUsersCount,
      percentageAvatarsSeen: this.getPercentage(
        totalUsersWithSeenAvatarCount,
        totalUsersCount,
      ),
    };
  }
  private getPercentage(base: number, divider: number): number {
    return math.multiply(math.divide(base, divider), 100);
  }
  private async createNewInternalUser(
    randomUserData: IRandomUserData,
  ): Promise<IUserData> {
    const insertModel: User = this.mapRandomUserDataToUser(randomUserData);

    const newUser: User = await this._usersRepository.save(insertModel);
    return this.getUserDataFromUser(newUser);
  }

  private mapRandomUserDataToUser(randomUserData: IRandomUserData): User {
    const user: User = new User();
    user.firstName = randomUserData.firstName;
    user.lastName = randomUserData.lastName;
    user.username = randomUserData.username;
    user.avatar = randomUserData.avatarUrl;
    user.email = randomUserData.email;

    return user;
  }
  private getUserDataFromUser(user: User): IUserData {
    return {
      id: user.id,
      avatarUrl: user.avatar,
      isAvatarSeen: user.isAvatarSeen,
    };
  }
  private async getRandomUser(): Promise<IRandomUserData> {
    return await this._randomDataService.getRandomUserData();
  }
}
