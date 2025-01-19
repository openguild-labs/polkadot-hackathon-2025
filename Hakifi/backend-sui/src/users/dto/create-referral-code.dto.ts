import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { ReferralCodeError } from '../constant/referralContants';

export class CreateReferralDto {
  userId: string;

  @ApiProperty({ default: 'CODE1' })
  @IsString()
  @Matches(/^[A-Z0-9]{6,8}$/, {
    message: ReferralCodeError.INVALID_REFERRAL_CODE,
  })
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  myPercent: number;
}
