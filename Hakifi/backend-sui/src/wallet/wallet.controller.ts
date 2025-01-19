import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { WalletsQueryDto } from './dto/query-wallet.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('wallets')
@ApiTags('Wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  findAll(@UserAuth() user: User, @Query() query: WalletsQueryDto) {
    query.userId = user.id;
    return this.walletService.getWallets(query);
  }

  @Post('withdraw-commission')
  withdraw(@UserAuth() user: User) {
    return this.walletService.withdraw(user.id);
  }

  //TODO: Please remove on mainnet
  @Get('faucet')
  faucet(@UserAuth() user: User) {
    return this.walletService.faucetUsdt(user);
  }
}
