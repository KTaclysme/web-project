import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MessageType {
  @Field(() => Int)
  id: number;

  @Field()
  message: string;
}