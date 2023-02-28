import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();
    const bearer = (authHeader as string).split(' ');
    if (bearer[0] !== 'Bearer' || !bearer[1]) throw new UnauthorizedException();
    const token = bearer[1];
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 's1l3nc315g0ld3n',
    });
    const decode: TokenPayload = await jwtService
      .verifyAsync(token)
      .catch((err) => {
        const message =
          err.name == 'TokenExpiredError' ? 'Token expired' : err.message;
        throw new UnauthorizedException(message);
      });

    req['user'] = decode;
    next();
  }
}
