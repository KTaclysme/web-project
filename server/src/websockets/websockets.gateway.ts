import { WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class CustomWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    client.join(`user-${userId}`);
    console.log(`Client connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    client.leave(`user-${userId}`);
    console.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: { fromUserId: number, toUserId: number, content: string }): void {
    this.server.to(`user-${message.toUserId}`).emit('receiveMessage', message);
  }
}