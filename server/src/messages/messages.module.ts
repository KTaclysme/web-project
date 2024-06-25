import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessagesResolver, MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
