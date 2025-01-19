import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async getUserDetails(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          avatar: true,
          Asset: true,
          market: true,
          wallets: {
            select: {
              nfts: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const totalNFTs = user.wallets?.reduce(
        (count, wallet) => count + wallet.nfts.length,
        0,
      );

      return {
        name: user.name,
        avatar: user.avatar,
        wallets: user.wallets,
        asserts: user.Asset,
        market: user.market,
        totalNFTs,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user details: ${error.message}`);
    }
  }

  async getUserbyName(name: string) {
    return await this.prisma.user.findUnique({
      where: {
        name: name,
      },
    });
  }

  async createNewUser(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        avatar: data.avatar,
      },
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        market: data.marketId,
      },
    });
  }
}
