import { ApiProperty } from "@nestjs/swagger";

export class CreateAutionMarketDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    userId: string;
}
