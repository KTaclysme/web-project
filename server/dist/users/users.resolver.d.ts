import { UsersService } from './users.service';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(context: any): Promise<{
        id: number;
        username: string;
        password: string;
    }>;
    users(): Promise<{
        id: number;
        username: string;
        password: string;
    }[]>;
    user(id: number): Promise<{
        id: number;
        username: string;
        password: string;
    }>;
}
