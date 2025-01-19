import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
  Patch,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserAuthRequest } from 'src/common/types/request.type';
import { ApiTags } from '@nestjs/swagger';
import { AddReferralCode } from './dto/add-referral-code.dto';
import {
  FriendsListByCodeQueryDto,
  FriendsListQueryDto,
} from './dto/query-list-friends.dto';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { FRIEND_TYPE } from './type/referral.type';
import { ReferralCodesService } from './referral-codes.service';
import { UpdateReferralDto } from './dto/update-referral-code.dto';
import { UpdateReferralInfoDto, UpdateUserDto } from './dto/update-user.dto';
import { CreateReferralDto } from './dto/create-referral-code.dto';
import { UserStatsDailyQueryDto } from './dto/user-stats-query.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly referralCodesService: ReferralCodesService,
  ) {}

  @Get('me')
  async getMe(@Req() req: UserAuthRequest) {
    const accessToken = req.cookies['access-token'];
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      accessToken,
      user,
    };
  }

  @Get('me/stats')
  async getMeStats(@Req() req: UserAuthRequest) {
    return this.usersService.getUserStats(req.user.id);
  }

  @Get('me/stats/daily')
  async getMeStatsDaily(
    @Req() req: UserAuthRequest,
    @Query() query: UserStatsDailyQueryDto,
  ) {
    query.userId = req.user.id;
    return this.usersService.getUserStatsDaily(query);
  }

  @Post('add-referral-code')
  async addReferralCode(@UserAuth() user: User, @Body() body: AddReferralCode) {
    return this.usersService.addReferralCodeToUser(user, body.code);
  }

  @Patch('/me')
  async updateUser(@UserAuth() user: User, @Body() body: UpdateUserDto) {
    return this.usersService.update(user, body);
  }

  @Put('referral-info')
  async updateReferralInfo(
    @UserAuth() user: User,
    @Body() body: UpdateReferralInfoDto,
  ) {
    body.parentId = user.id;
    return this.usersService.updateReferralInfo(body);
  }

  @Get('/friends')
  async getFriends(
    @UserAuth() user: User,
    @Query() query: FriendsListQueryDto,
  ) {
    query.userId = user.id;
    if (!user.isPartner) query.type = FRIEND_TYPE.F1;
    const { rows, total } = await this.usersService.getFriendsList(query);
    return {
      rows: await this.referralCodesService.friendsWithInfo(rows, user.id),
      total,
    };
  }

  @Get('/friends/:friendId')
  getFriendDetail(
    @UserAuth() user: User,
    @Param('friendId', ParseObjectIdPipe) friendId: string,
  ) {
    return this.usersService.getFriendDetail(user.id, friendId);
  }

  @Get('/referral-codes')
  async getReferralCodes(@UserAuth() user: User) {
    return this.referralCodesService.getReferralCodes(user.id);
  }

  @Get('/referral-codes/:code')
  async getRefCodeDetal(@UserAuth() user: User, @Param('code') code: string) {
    const refCode = await this.referralCodesService.findOne(user.id, code);
    if (!refCode) {
      throw new NotFoundException('Referral code not found');
    }
    return refCode;
  }

  @Post('/referral-codes')
  async createReferralCode(
    @UserAuth() user: User,
    @Body() body: CreateReferralDto,
  ) {
    body.userId = user.id;
    return this.referralCodesService.createCustomReferralCode(body);
  }

  @Patch('/referral-codes/:code')
  async updateReferralCode(
    @UserAuth() user: User,
    @Param('code') code: string,
    @Body() body: UpdateReferralDto,
  ) {
    return this.referralCodesService.updateReferralCode(user.id, code, body);
  }

  @Get('/referral-codes/:code/friends')
  async getFriendsByReferralCode(
    @UserAuth() user: User,
    @Param('code') code: string,
    @Query() query: FriendsListByCodeQueryDto,
  ) {
    query.userId = user.id;
    query.code = code;

    const { rows, total } =
      await this.referralCodesService.getFriendsByReferralCode(query);

    return {
      rows: await this.referralCodesService.friendsWithInfo(
        rows as User[],
        user.id,
      ),
      total,
    };
  }
}
