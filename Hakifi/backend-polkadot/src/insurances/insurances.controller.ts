import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { InsurancesService } from './insurances.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ListInsuranceQueryDto } from './dto/query-insurance.dto';
import { UserAuth } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { UpdateTxHashDto } from './dto/update-insurance.dto';

@Controller('insurances')
@ApiTags('Insurances')
export class InsurancesController {
  constructor(private readonly insurancesService: InsurancesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserAuth() user: User,
    @Body() createInsuranceDto: CreateInsuranceDto,
  ) {
    return this.insurancesService.create(user.id, createInsuranceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@UserAuth() user: User, @Query() query: ListInsuranceQueryDto) {
    query.userId = user.id;
    return this.insurancesService.findAll(query);
  }

  @Get('q-cover-packs')
  getAllQCoverPacks() {
    return this.insurancesService.getAllQCoverPacks();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @UserAuth() user: User,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    const insurance = await this.insurancesService.findOne(id, user.id);
    if (!insurance) {
      throw new BadRequestException('Insurance not found');
    }
    return insurance;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/contract')
  getInsuranceContract(@Param('id', ParseObjectIdPipe) id: string) {
    return this.insurancesService.getInsuranceContract(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  cancel(@UserAuth() user: User, @Param('id', ParseObjectIdPipe) id: string) {
    return this.insurancesService.cancelInsurance(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/update-txhash')
  async updateTxHash(
    @UserAuth() user: User,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTxHashDto: UpdateTxHashDto,
  ) {
    const insurance = await this.insurancesService.updateTxHash(
      user.id,
      id,
      updateTxHashDto.txhash,
    );
    if (!insurance) {
      throw new BadRequestException('Insurance not found');
    }
    return insurance;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('pending/:id')
  delete(@UserAuth() user: User, @Param('id', ParseObjectIdPipe) id: string) {
    return this.insurancesService.deletePendingInsurance(user.id, id);
  }
}
