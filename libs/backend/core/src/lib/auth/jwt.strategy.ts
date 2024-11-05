import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from '@projectx/models';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JwtStrategy is passport JWT strategy.
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwtSecret'),
    });
  }

  /**
   * validate returns jwt payload.
   * @param payload - Payload with the info of the user
   *
   * @returns
   * @memberof JwtStrategy
   */
  async validate(payload: AuthPayload) {
    return {
      userId: Number(payload.sub),
      email: payload.email,
      username: payload.username,
    };
  }
}
