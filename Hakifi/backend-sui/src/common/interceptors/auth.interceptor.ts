import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const accessToken = req.cookies['access-token'];

    if (accessToken) {
      try {
        const payload = this.authService.verifyToken(accessToken);
        req.user = payload;
      } catch (error) {}
    }
    return next.handle();
  }
}
