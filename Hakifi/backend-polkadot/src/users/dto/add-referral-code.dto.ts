import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddReferralCode {
  @ApiProperty({ default: 'CODE1' })
  @IsString()
  code: string;
}
