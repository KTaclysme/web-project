import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        username: string;
        password: string;
    }): Promise<User>;
    findAll(): Promise<User[]>;
    findOneById(id: number): Promise<User | null>;
    findOneByUsername(username: string): Promise<User | null>;
}
