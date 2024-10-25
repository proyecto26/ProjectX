
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AuthUser } from './user.interface';

export const User = createParamDecorator<keyof AuthUser, ExecutionContext>(
  (data: keyof AuthUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    if (!user) {
      throw new UnauthorizedException();
    }
    return data ? user[data] : user;
  },
);
