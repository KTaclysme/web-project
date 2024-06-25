import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { SampleResolver } from './sample/sample.resolver';
import { SampleService } from './sample/sample.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver : ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    MessagesModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    SampleResolver,
    SampleService
  ],
})
export class AppModule {}
