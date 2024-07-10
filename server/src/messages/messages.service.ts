import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '.prisma/client';
import { BullMQService } from '../bullmq/bullmq.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bullMQService: BullMQService, 
  ) {}

  async createMessageAndQueue(data: { content: string; fromUserId: number; toUserId: number }): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
      },
    });
    return message;
  }

  async findAllByUserId(userId: number): Promise<Message[] | null> {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId },
        ],
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
    });
  }
}
