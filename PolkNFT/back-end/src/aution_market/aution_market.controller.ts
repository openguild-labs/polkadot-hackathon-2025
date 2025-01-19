import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutionMarketService } from './aution_market.service';
import { CreateAutionMarketDto } from './dto/create-aution_market.dto';
import { UpdateAutionMarketDto } from './dto/update-aution_market.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auction market')
@Controller({ version: '1', path: 'auction-market' })
export class AutionMarketController {
  constructor(private readonly autionMarketService: AutionMarketService) {}

  @Post('newMarket')
  create(@Body() createAutionMarketDto: CreateAutionMarketDto) {
    return this.autionMarketService.create(createAutionMarketDto);
  }

  @Get(':id/findOtherMarket')
  findOtherMarket(@Param('id') userId: string) {
    return this.autionMarketService.findAllExpertUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autionMarketService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutionMarketDto: UpdateAutionMarketDto) {
    return this.autionMarketService.update(id, updateAutionMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autionMarketService.remove(id);
  }

  @Get()
  getAllAuction() {
    return this.autionMarketService.findAllAuction()
  }
}
