import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { INSURANCE_EVENTS } from 'src/common/constants/event';
import { Insurance } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  @WebSocketServer() server: Server;

  constructor(private readonly authService: AuthService) {}

  afterInit() {
    this.logger.log('Socket initialized');
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong' };
  }

  handleConnection(client: Socket) {
    if (client.handshake.query && client.handshake.query.token) {
      const accessToken = client.handshake.query.token as string;
      try {
        const payload = this.authService.verifyToken(accessToken);
        client.data.user = payload;
        if (payload.id) {
          client.join(payload.id);
        }
      } catch (error) {}
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user?.id) {
      client.leave(client.data.user.id);
    }
  }

  @OnEvent(INSURANCE_EVENTS.CREATED)
  handleInsuranceCreated(data: Insurance) {
    this.server.to(data.userId).emit(INSURANCE_EVENTS.CREATED, data);
  }

  @OnEvent(INSURANCE_EVENTS.UPDATED)
  handleInsuranceUpdated(data: Insurance) {
    this.server.to(data.userId).emit(INSURANCE_EVENTS.UPDATED, data);
  }
}
