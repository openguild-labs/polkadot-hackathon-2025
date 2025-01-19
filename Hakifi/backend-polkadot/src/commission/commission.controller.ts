import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CommissionService } from './commission.service';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { ListCommissionsQueryDto } from './dto/query-commission.dto';

@Controller('commissions')
@ApiTags('Commission')
@UseGuards(JwtAuthGuard)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  async findAll(
    @UserAuth() user: User,
    @Query() query: ListCommissionsQueryDto,
  ) {
    query.userId = user.id;
    return this.commissionService.findAll(query);
  }
}
