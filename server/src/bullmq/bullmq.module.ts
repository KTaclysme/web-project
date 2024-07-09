import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullMQService } from './bullmq.service';
import { MessageProcessor } from './bullmq.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'messages',
    }),
    PrismaModule,
  ],
  providers: [BullMQService, MessageProcessor],
  exports: [BullMQService],
})
export class BullMQModule {}