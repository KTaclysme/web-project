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
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { BullMQService } from '../bullmq/bullmq.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { MessageType } from './dto/message.type';
import { MessageInput } from './dto/message.input';

@Resolver(of => MessageType)
export class MessagesResolver {
  constructor(private readonly bullMQService: BullMQService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(returns => Boolean)
  async sendMessage(
    @Args('messageInput') messageInput: MessageInput,
    @Context() context,
  ) {
    const { userId } = context.req.user;
    await this.bullMQService.sendMessage(userId, messageInput.toUserId, messageInput.content);
    return true;
  }
}