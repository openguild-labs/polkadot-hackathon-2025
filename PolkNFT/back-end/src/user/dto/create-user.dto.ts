import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ required: true})
    name: string;

    @ApiProperty({ required: true})
    avatar: string;
}
