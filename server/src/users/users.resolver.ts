import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './dto/user.type';
import { AuthInput } from '../auth/dto/auth.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlJwtAuthGuard } from 'src/auth/gql-jwt-auth.guard';

@Resolver(of => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(returns => UserType)
  async me(@Context() context) {
    const { userId } = context.req.user;
    return this.usersService.findOneById(userId);
  }
  
  @Query(returns => [UserType])
  async users() {
    return this.usersService.findAll();
  }

  @Query(returns => UserType, { nullable: true })
  async user(@Args('id', { type: () => Number }) id: number) {
    return this.usersService.findOneById(id);
  }
}