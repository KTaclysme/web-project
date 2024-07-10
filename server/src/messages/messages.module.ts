import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { BullMQModule } from '../bullmq/bullmq.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesService } from './messages.service';

@Module({
  imports: [BullMQModule, PrismaModule],
  providers: [MessagesResolver,MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
