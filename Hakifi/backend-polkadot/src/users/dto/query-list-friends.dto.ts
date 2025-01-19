import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { FRIEND_TYPE } from '../type/referral.type';

export class FriendsListQueryDto extends PaginationQueryDto {
  allowSortFields: ['invitedAt'];

  userId: string;

  @ApiPropertyOptional({
    enum: FRIEND_TYPE,
  })
  @IsOptional()
  @IsEnum(FRIEND_TYPE)
  type?: FRIEND_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @ApiPropertyOptional({
    default: new Date(),
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  invitedAtFrom?: Date;

  @ApiPropertyOptional({
    default: new Date(),
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  invitedAtTo?: Date;
}

export class FriendsListByCodeQueryDto extends PaginationQueryDto {
  allowSortFields: ['invitedAt'];

  userId: string;
  code: string;
}
