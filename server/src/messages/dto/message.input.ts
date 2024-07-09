import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class MessageInput {
  @Field()
  content: string;

  @Field(type => Int)
  toUserId: number;
}