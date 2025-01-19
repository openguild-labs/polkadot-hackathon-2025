import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/configs/config.interface';
import { verifyPersonalMessage } from '@mysten/sui.js/verify'
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {}

  public async loginWithCredentials(loginDTO: AuthDto) {
    const { walletAddress, signature } = loginDTO;

    let user = await this.usersService.findByWalletAddress(walletAddress);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    if (!user.nonce) {
      throw new UnauthorizedException('Nonce not found!');
    }

    try {
      const isValid = this.verifySignature(
        walletAddress,
        user.nonce,
        signature,
      );
      if (!isValid) {
        throw new Error();
      }
    } catch (error) {
      throw new UnauthorizedException('Signature is invalid');
    }

    user = await this.usersService.updateUserOnLogin(walletAddress);

    const payload = { id: user.id, walletAddress };

    return {
      accessToken: this.generateToken(payload),
      user,
    };
  }

  public prepareSigningMessage(nonce: number) {
    return `Please sign this message to verify your address. Nonce: ${nonce}`;
  }

  public async verifySignature(
    walletAddress: string,
    nonce: number,
    signature: string,
  ) {    
    const message = this.prepareSigningMessage(nonce);
    const messageEncoded = new TextEncoder().encode(message);
    const publicKey = await verifyPersonalMessage(messageEncoded, signature);
    if (publicKey.toSuiAddress() !== walletAddress) {      
      throw new Error('Signature was valid, but was signed by a different key pair');
    }
    return true;
  }

  public generateToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwtSecretKey'),
    });
  }

  public verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('jwtSecretKey'),
    });
  }
}
