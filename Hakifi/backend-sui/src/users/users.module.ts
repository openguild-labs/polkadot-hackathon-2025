import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersCommand } from './users.commands';
import { ReferralCodesService } from './referral-codes.service';
import { UsersSchedule } from './users.schedule';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCommand, ReferralCodesService, UsersSchedule],
  exports: [UsersService],
})
export class UsersModule {}
