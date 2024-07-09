import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BullMQService {
  constructor(
    @InjectQueue('messages') private readonly messageQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async sendMessage(fromUserId: number, toUserId: number, content: string) {
    await this.messageQueue.add('send', { fromUserId, toUserId, content });
  }

  async handleMessageJob(job: any) {
    const { fromUserId, toUserId, content } = job.data;
    await this.prisma.message.create({
      data: {
        toUserId,
        content,
        fromUserId,
      },
    });
  }
}