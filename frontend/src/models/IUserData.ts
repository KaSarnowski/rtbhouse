export interface IUserData {
  id: number;
  avatarUrl: string;
  isAvatarSeen: boolean;
}
export interface IUserDataApiResponse extends IUserData {
  token: string;
}
