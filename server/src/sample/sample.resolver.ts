import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class SampleResolver {
  @Query(() => String)
  hello(): string {
    return "Bienvenue sur l'application de chat !";
  }
}