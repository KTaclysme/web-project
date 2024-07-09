import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MessageType {
  @Field(type => Int)
  id: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(type => Int)
  fromUserId: number;

  @Field(type => Int)
  toUserId: number;
}