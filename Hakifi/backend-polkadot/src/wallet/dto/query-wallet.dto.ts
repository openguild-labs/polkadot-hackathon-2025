import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseUnit } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class WalletsQueryDto {
  userId: string;

  @ApiPropertyOptional({
    enum: BaseUnit,
  })
  @IsOptional()
  @IsEnum(BaseUnit)
  asset?: BaseUnit;
}
