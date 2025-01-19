import { ApiProperty } from "@nestjs/swagger";

export class CreateAssetDto {
    @ApiProperty()
    nftId: string;

    @ApiProperty()
    startAt: string;

    @ApiProperty()
    endAt: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    type: string
}
