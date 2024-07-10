import { Module } from '@nestjs/common';
import { CustomWebSocketGateway } from './websockets.gateway';

@Module({
  providers: [CustomWebSocketGateway],
  exports: [CustomWebSocketGateway],
})
export class WebSocketsModule {}