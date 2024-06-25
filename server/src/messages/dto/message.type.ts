import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MessageType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  content: string;
}