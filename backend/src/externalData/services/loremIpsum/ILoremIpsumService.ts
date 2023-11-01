export interface ILoremIpsumService {
  getLoremIpsum(lines: number, userId: number): Promise<any>;
}
