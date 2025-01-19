import { ApiProperty } from '@nestjs/swagger';

export class UpdateAssetDto {
  @ApiProperty()
  startAt: string;

  @ApiProperty()
  endAt: string;

  @ApiProperty()
  listPrice: number;

  @ApiProperty()
  userId: string;
}
