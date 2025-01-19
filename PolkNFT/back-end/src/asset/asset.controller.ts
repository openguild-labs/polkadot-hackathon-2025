import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asset')
@Controller({ version: '1', path: 'asset' })
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('newAsset')
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get(':id')
  findAll(@Param('id') userId: string) {
    return this.assetService.findAllBasedUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetService.update(id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }

  @Get()
  getAllAssets() {
    return this.assetService.findAllAssets()
  }
}
