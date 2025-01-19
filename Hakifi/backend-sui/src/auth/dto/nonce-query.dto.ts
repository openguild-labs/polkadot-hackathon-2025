import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsSuiAddress } from 'src/common/validators/is-sui-address';

export class NonceQueryDTO {
  @ApiProperty({
    type: String,
    description: 'Sui address',
    example: '0x412b26641ed4e28dccccfe8a2d975ee1fa237364c41cb2fe26f684bebe8d66a1',
  })
  @IsNotEmpty()
  @IsSuiAddress()
  walletAddress: string;
}
