import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from './dto/message.type';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { id: number, content: string, userId: number }): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        id: data.id,
        content: data.content,
        userId: data.userId
      },
    });
    return message;
  }

  async findAllByUserId(userId: number): Promise<MessageType[]> {
    return this.prisma.message.findMany({
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
