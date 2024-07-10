import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CustomWebSocketGateway } from '../websockets/websockets.gateway';

@Injectable()
export class BullMQService {
  constructor(
    @InjectQueue('messages') private readonly messageQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly webSocketGateway: CustomWebSocketGateway,
  ) {}

  async sendMessage(fromUserId: number, toUserId: number, content: string) {
    await this.messageQueue.add('send', { fromUserId, toUserId, content });
  }

  async handleMessageJob(job: any) {
    const { fromUserId, toUserId, content } = job.data;
    const message = await this.prisma.message.create({
      data: {
        toUserId,
        content,
        fromUserId,
      },
    });
    this.webSocketGateway.server.to(`user-${toUserId}`).emit('receiveMessage', message);
  }
}