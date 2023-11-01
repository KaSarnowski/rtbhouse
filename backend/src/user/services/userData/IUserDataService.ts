export interface IUserDataService {
  getNewUserData(): Promise<IUserData>;
  setAvatarSeen(userId: number): Promise<void>;
  getUserStats(): Promise<IUserStats>;
}

export interface IUserStats {
  totalUsers: number;
  percentageAvatarsSeen: number;
}
export interface IUserData {
  id: number;
  avatarUrl: string;
  isAvatarSeen: boolean;
}
