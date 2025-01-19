import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AutionMarketModule } from './aution_market/aution_market.module';
import { AssetModule } from './asset/asset.module';

@Module({
  imports: [AutionMarketModule, AssetModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
