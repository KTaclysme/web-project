import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';
import { UserType } from 'src/users/dto/user.type';


@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { message: string, userId: number }) {
    return await this.prisma.message.create({
      data: {
        content: data.message,
        userId: data.userId
      },
    });
  }

  async findAll(): Promise<Message[]> {
    return await this.prisma.message.findMany();;
  }
}
