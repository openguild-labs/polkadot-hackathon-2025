import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ListTokenQueryDto } from './dto/token-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: ListTokenQueryDto) {
    const where: Prisma.TokenWhereInput = {};
    if (query.q) {
      where.OR = [
        {
          name: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          symbol: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prismaService.token.count({ where }),
      this.prismaService.token.findMany({
        skip: query.skip,
        take: query.limit,
        where,
      }),
    ]);

    return {
      rows,
      total,
    };
  }

  findOne(id: string) {
    return this.prismaService.token.findUnique({
      where: {
        id,
      },
    });
  }

  async getTags() {
    return this.prismaService.tag.findMany();
  }
}
