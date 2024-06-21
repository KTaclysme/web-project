import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { UserType } from '../users/dto/user.type';
import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => AuthType)
  async login(@Args('authInput') authInput: AuthInput) {
    const user = await this.authService.validateUser(authInput.username, authInput.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Mutation(() => UserType)
  async signup(@Args('authInput') authInput: AuthInput): Promise<UserType> {
    return this.usersService.create(authInput);
  }
}