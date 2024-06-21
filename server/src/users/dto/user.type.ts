import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  password: string;
}