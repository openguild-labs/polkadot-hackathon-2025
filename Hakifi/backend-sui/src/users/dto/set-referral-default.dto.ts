import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SetDefaultReferralDto {
  @ApiProperty({ default: 'CODE1' })
  @IsString()
  defaultRefCode: string;
}
