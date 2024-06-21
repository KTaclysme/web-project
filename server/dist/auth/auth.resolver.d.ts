import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthInput } from './dto/auth.input';
import { UserType } from '../users/dto/user.type';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(authInput: AuthInput): Promise<{
        access_token: string;
    }>;
    signup(authInput: AuthInput): Promise<UserType>;
}
