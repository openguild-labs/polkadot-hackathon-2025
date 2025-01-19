import { Injectable } from '@nestjs/common';
import { CreateAutionMarketDto } from './dto/create-aution_market.dto';
import { UpdateAutionMarketDto } from './dto/update-aution_market.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AutionMarketService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAutionMarketDto: CreateAutionMarketDto) {
    return await this.prisma.auction_market.create({
      data: {
        name: createAutionMarketDto.name,
        image: createAutionMarketDto.image,
        userId: createAutionMarketDto.userId,
      }
    })
  }

  async findAllExpertUser(userId: string) {
    const marketList = await this.prisma.auction_market.findMany();
    const filteredMarket = marketList.filter((item) => item.userId != userId)
    return filteredMarket
  }

  async findOne(id: string) {
    return await this.prisma.auction_market.findUnique({
      where: {
        userId: id
      }
    });
  }

  async update(id: string, updateAutionMarketDto: UpdateAutionMarketDto) {
    return await this.prisma.auction_market.update({
      where: {
        id: id
      },
      data: {
        name: updateAutionMarketDto.name,
        image: updateAutionMarketDto.image,
        userId: updateAutionMarketDto.userId
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.auction_market.delete({
      where: {
        id: id
      }
    });
  }

  async findAllAuction() {
    return await this.prisma.auction_market.findMany()
  }
}
