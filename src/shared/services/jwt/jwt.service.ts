import { Injectable } from '@nestjs/common';
import { IJwtSingin, IValidateToken } from 'src/shared/models/general.models';
import { JwtPayload, sign, verify } from "jsonwebtoken";

@Injectable()
export class JwtService {
  private SECRET = process.env.JWT_SECRET;

  constructor() {}

  singin(config: IJwtSingin): string {
    const { sub, expirateNumber, expirateTime } = config;
    const iat = Date.now();
    let exp = 0;

    switch (expirateTime) {
      case 'hours':
        exp = iat + (expirateNumber * 60000 * 60)
        break;
      case 'minutes':
        exp = iat + (expirateNumber * 60000)
        break;
      default:
        exp = iat + (expirateNumber * 1000)
        break;
    }

    return sign({ sub, iat, exp }, this.SECRET);
  }

  validate(token: string): IValidateToken {
    try {
      const iat = Date.now();
      const payload = verify(token, this.SECRET) as JwtPayload;

      if (payload.exp <= iat) {
        return {
          status: false,
        };
      }

      return {
        status: true,
        payload
      };
    } catch (error) {
      return {
        status: false,
      };
    }
  }
}
