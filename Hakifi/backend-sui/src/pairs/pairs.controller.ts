import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PairsService } from './pairs.service';
import { ListPairQueryDto } from './dto/token-query.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserAuthRequest } from 'src/common/types/request.type';
import { CreateFavoritePairsDto } from './dto/favorite-pair.dto';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { Prisma, User } from '@prisma/client';
import { AuthInterceptor } from 'src/common/interceptors/auth.interceptor';
import { PrismaService } from 'nestjs-prisma';
import dayjs from 'dayjs';

@Controller('pairs')
@ApiTags('Pairs')
export class PairsController {
  constructor(
    private readonly pairsService: PairsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @UseInterceptors(AuthInterceptor)
  findAll(@Req() req: UserAuthRequest, @Query() query: ListPairQueryDto) {
    query.userId = req.user?.id;
    return this.pairsService.findAll(req.url, query);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  findFavorites(@Req() req: UserAuthRequest, @Query() query: ListPairQueryDto) {
    return this.pairsService.getFavoritePairs(req.user.id, query);
  }

  @Get('market-pairs')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds
  getMarketPairs() {
    return this.pairsService.getMarketPairs();
  }

  @Get(':symbol')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds
  async findOne(@Param('symbol') symbol: string) {
    const pair = await this.pairsService.findOne(symbol);

    const lastD1Time = dayjs().utc().startOf('d').valueOf();

    const signal = await this.prismaService.symbolPrediction.findUnique({
      where: {
        symbol_chartInterval_date: {
          chartInterval: '1d',
          date: lastD1Time,
          symbol: symbol.toUpperCase(),
        },
      },
      select: {
        signal: true,
      },
    });

    // TODO: @Tule - find all singal of symbol
    // const test = await this.prismaService.symbolPrediction.findMany({
    //   where: {
    //     symbol: symbol.toUpperCase(),
    //   },
    //   orderBy: {
    //     date: Prisma.SortOrder.desc,
    //   },
    //   distinct: ['chartInterval'],
    // });

    // console.log(test);

    return {
      id: pair.id,
      symbol: pair.symbol,
      asset: pair.asset,
      unit: pair.unit,
      isMaintain: pair.isMaintain,
      isActive: pair.isActive,
      isHot: pair.isHot,
      signal: signal?.signal ?? '',
      token: {
        id: pair.token.id,
        symbol: pair.token.symbol,
        attachment: pair.token.attachment,
        decimals: pair.token.decimals,
      },
      config: {
        listChangeRatios: await this.pairsService.getConfigPeriod(pair),
      },
    };
  }

  @Get('favorites/all-symbols')
  @UseGuards(JwtAuthGuard)
  getAllFavoriteSymbols(@Req() req: UserAuthRequest) {
    return this.pairsService.getAllFavoriteSymbols(req.user.id);
  }

  @Post('favorites/:symbol')
  @ApiParam({ name: 'symbol', example: 'BNBUSDT' })
  @UseGuards(JwtAuthGuard)
  favorite(@UserAuth() user: User, @Param('symbol') symbol: string) {
    return this.pairsService.addFavoritePair(user.id, symbol.toUpperCase());
  }

  @Delete('favorites/:symbol')
  @ApiParam({ name: 'symbol', example: 'BNBUSDT' })
  @UseGuards(JwtAuthGuard)
  unfavorite(@Req() req: UserAuthRequest, @Param('symbol') symbol: string) {
    return this.pairsService.removeFavoritePair(
      req.user.id,
      symbol.toUpperCase(),
    );
  }

  @Post('favorites')
  @UseGuards(JwtAuthGuard)
  favoriteMultiSymbols(
    @Req() req: UserAuthRequest,
    @Body() body: CreateFavoritePairsDto,
  ) {
    return this.pairsService.addFavoritePairs(req.user.id, body.symbols);
  }
}
