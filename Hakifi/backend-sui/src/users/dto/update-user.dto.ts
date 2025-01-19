import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserError } from '../constant/userContants';
import { ReferralCodeError } from '../constant/referralContants';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_.]+$/, { message: UserError.INVALID_USER_NAME })
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^(\+\d{1,3}|0)\d{9}$/, { message: UserError.INVALID_PHONE_NUMBER })
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{6,8}$/, {
    message: ReferralCodeError.INVALID_REFERRAL_CODE,
  })
  refCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{6,8}$/)
  defaultMyRefCode?: string;
}

export class UpdateReferralInfoDto {
  parentId: string;

  @ApiProperty()
  @IsMongoId()
  childId: string;

  @ApiProperty()
  @IsString()
  note?: string;
}
