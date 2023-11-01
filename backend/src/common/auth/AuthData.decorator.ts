import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserRequestData } from '../models/IUserRequestData';
import * as core from 'express-serve-static-core';

type AuthorizedRequest = core.Request & { user: IUserRequestData };

export const AuthData: (...dataOrPipes: any[]) => ParameterDecorator =
  createParamDecorator((_, ctx: ExecutionContext): IUserRequestData => {
    const req: AuthorizedRequest = ctx
      .switchToHttp()
      .getRequest<AuthorizedRequest>();

    return req.user as IUserRequestData;
  });
