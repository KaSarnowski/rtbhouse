import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ILoremIpsumService } from '../services/loremIpsum/ILoremIpsumService';
import { AuthGuard } from '../../common/auth/Auth.guard';
import { AuthData } from '../../common/auth/AuthData.decorator';
import { IUserRequestData } from '../../common/models/IUserRequestData';

@Controller('loremIpsum')
export class LoremIpsumController {
  constructor(
    @Inject('LoremIpsumService')
    private readonly loremIpsumService: ILoremIpsumService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  public async getLoremIpsum(
    @Query('lines') lines: number,
    @AuthData() authData: IUserRequestData,
  ): Promise<string> {
    return await this.loremIpsumService.getLoremIpsum(lines, authData.id);
  }
}
