import { IRandomDataService } from './IRandomDataService';

export const RandomDataServiceMock: IRandomDataService = {
  getRandomUserData: jest.fn(),
};
