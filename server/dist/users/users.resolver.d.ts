import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): string;
    findAll(): string;
    findOne(id: number): string;
    updateUser(updateUserInput: UpdateUserInput): string;
    removeUser(id: number): string;
}
