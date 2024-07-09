import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { BullMQModule } from '../bullmq/bullmq.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [BullMQModule, PrismaModule],
  providers: [MessagesResolver],
})
export class MessagesModule {}
