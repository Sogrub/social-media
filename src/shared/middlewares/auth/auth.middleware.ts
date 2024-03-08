import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from 'src/shared/services/jwt/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService){}

  use(req: Request, res: Response, next: () => void) {
    const headerToken = req.headers.authorization || '';
    const token = String(headerToken).replace("Bearer ", "");
    const jwtValidate = this.jwtService.validate(token);

    if (!jwtValidate.status) {
      return res.status(401).send({
        status: 401,
        message: 'El token se encuentra vencido o es invalido.'
      })
    }

    req['payload'] = jwtValidate.payload

    next();
  }
}
