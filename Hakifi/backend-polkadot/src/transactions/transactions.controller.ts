import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { ListTransactionQueryDto } from './dto/query-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiTags('Insurances')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@UserAuth() user: User, @Query() query: ListTransactionQueryDto) {
    query.userId = user.id;
    return this.transactionsService.findAll(query);
  }
}
