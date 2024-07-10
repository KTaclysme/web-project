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

  async findAllMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[] | null> {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: userId1, toUserId: userId2 },
          { fromUserId: userId2, toUserId: userId1 },
        ],
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }  
  
}
