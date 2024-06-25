import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { MessageType } from './dto/message.type';

@Resolver(() => MessageType)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [MessageType], { name: 'messages' })
  findAll() {
    return this.messagesService.findAll();
  }
}