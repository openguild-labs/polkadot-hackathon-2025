import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    nullable: true,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Max(100)
  readonly limit?: number = 10;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  readonly sort?: string;

  skip = 0;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  readonly q?: string;

  orderBy?: any;

  allowSortFields: string[] = [];

  defaultSort?: string;
}

export class PaginationQueryOffsetDto {
  @ApiProperty({
    nullable: true,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly offset?: number = 0;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Max(100)
  readonly limit?: number = 30;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  readonly sort?: string;
}
