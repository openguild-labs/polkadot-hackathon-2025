import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { NonceQueryDTO } from './dto/nonce-query.dto';
import { UsersService } from 'src/users/users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.loginWithCredentials(body);

    res.cookie('access-token', data.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return data;
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access-token');
    return { message: 'Logged out successfully' };
  }


  @Get('/nonce')
  async getNonce(@Query() query: NonceQueryDTO) {
    const nonce = await this.usersService.getNonce(query.walletAddress);
    const message = this.authService.prepareSigningMessage(nonce);
    return { nonce, message };
  }
}
