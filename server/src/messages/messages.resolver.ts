import { Resolver, Mutation, Args, Context, Query, Int } from '@nestjs/graphql';
import { BullMQService } from '../bullmq/bullmq.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { MessageType } from './dto/message.type';
import { MessageInput } from './dto/message.input';
import { MessagesService } from './messages.service';

@Resolver(of => MessageType)
export class MessagesResolver {
  constructor(
    private readonly bullMQService: BullMQService,
    private readonly messagesService: MessagesService
  ) {}

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

  @Query(returns => [MessageType])
  findAllByUserId(@Args('userId', { type: () => Int }) userId: number) {
    return this.messagesService.findAllByUserId(userId);
  }
}
