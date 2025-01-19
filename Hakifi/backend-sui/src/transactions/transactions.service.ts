import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTransactionDto } from './dto/transaction.dto';
import { ListTransactionQueryDto } from './dto/query-transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name); 
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const existed = await this.prismaService.transaction.findFirst({
      where: { txhash: data.txhash },
    });
    if (existed) {
      this.logger.debug("Transaction already existed", existed)
      return existed;
    }

    const txn = await this.prismaService.transaction.create({
      data,
    });
    this.logger.debug("Transaction created", txn)
    return txn;
  }

  async findAll(query: ListTransactionQueryDto) {
    const where: Prisma.TransactionWhereInput = {
      userId: query.userId,
    };

    if (query.q) {
      where.txhash = { contains: query.q, mode: 'insensitive' };
    }

    if (query.from || query.to) {
      where.time = {};
      if (query.from) where.time.gte = query.from;
      if (query.to) where.time.lte = query.to;
    }

    if (query.unit) {
      where.unit = query.unit;
    }

    if (query.type) {
      where.type = query.type;
    }

    const [total, rows] = await Promise.all([
      this.prismaService.transaction.count({ where }),
      this.prismaService.transaction.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
      }),
    ]);

    return {
      total,
      rows,
    };
  }
}
