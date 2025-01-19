import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAssetDto: CreateAssetDto) {
    const assetExists = await this.prisma.user.findUnique({
      where: { name: createAssetDto.userId },
    });
  
    if (!assetExists) {
      throw new Error(`User with id ${createAssetDto.userId} does not exist.`);
    }

    return await this.prisma.asset.create({
      data: {
        nftId: createAssetDto.nftId,
        startAt: createAssetDto.startAt,
        endAt: createAssetDto.endAt,
        userId: createAssetDto.userId,
        highest_bid: 0,
        image: createAssetDto.image,
        type: createAssetDto.type,
      }
    });
  }

  async findAllBasedUserId(id: string) {
    return await this.prisma.asset.findMany({
      where: {
        userId: id
      }
    });
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    return await this.prisma.asset.update({
      where: {
        id: id
      },
      data: {
        startAt: updateAssetDto.startAt,
        endAt: updateAssetDto.endAt,
        highest_bid: updateAssetDto.listPrice,
        userId: updateAssetDto.userId
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.asset.delete({
      where: {
        id: id
      }
    });
  }

  async findAllAssets() {
    return await this.prisma.asset.findMany()
  }
}
