import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { MessageType } from './dto/message.type';

@Resolver(() => MessageType)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => MessageType)
async createMessage(
  @Args('id', { type: () => Int }) id: number,
  @Args('content') content: string,
  @Args('userId', { type: () => Int }) userId: number,
  ): Promise<MessageType> {
  return await this.messagesService.createMessage({ id, content, userId });
}

  @Query(() => [MessageType], { name: 'messages' })
  findAllByUserId(@Args('userId', {type: () => Int}) userId: number) {
    return this.messagesService.findAllByUserId(userId);
  }
}
