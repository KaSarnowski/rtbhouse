export interface IRandomDataService {
  getRandomUserData(): Promise<IRandomUserData>;
}

export interface IRandomUserData {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  email: string;
}
