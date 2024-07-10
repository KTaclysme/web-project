import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let userService: UsersService;

  // Avant chaque test, configurer le module de test
  beforeEach(async () => {
    // Créer un module de test avec UsersResolver et un UsersService mocké
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),  // Mock de la méthode findOneById du UsersService
            findAll: jest.fn(),      // Mock de la méthode findAll du UsersService
          },
        },
      ],
    })
      .overrideGuard(GqlJwtAuthGuard)  // Remplacer le GqlJwtAuthGuard par une version mockée
      .useValue({ canActivate: () => true })  // Définir le comportement du mock du GqlJwtAuthGuard
      .compile();

    resolver = module.get<UsersResolver>(UsersResolver);  // Récupérer l'instance du UsersResolver
    userService = module.get<UsersService>(UsersService);  // Récupérer l'instance mockée du UsersService
  });

  // Test pour vérifier que le resolver est défini
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Bloc de tests pour la méthode me
  describe('me', () => {
    it('should return the current user', async () => {
      const mockUserId = 1;
      const mockUser = { id: mockUserId, username: 'testuser', password: 'hashedpassword' };

      const mockContext = {
        req: {
          user: { userId: mockUserId },  // Contexte simulé avec l'ID utilisateur
        },
      };

      jest.spyOn(userService, 'findOneById').mockResolvedValue(mockUser);  // Espionner findOneById pour retourner mockUser

      const result = await resolver.me(mockContext);  // Appeler la méthode me du resolver avec le mockContext

      // Vérifier que le résultat correspond au mockUser et que findOneById a été appelé avec mockUserId
      expect(result).toBe(mockUser);
      expect(userService.findOneById).toHaveBeenCalledWith(mockUserId);
    });
  });

  // Bloc de tests pour la méthode users
  describe('users', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, username: 'testuser1', password: 'hashedpassword1' },
        { id: 2, username: 'testuser2', password: 'hashedpassword2' },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(mockUsers);  // Espionner findAll pour retourner mockUsers

      const result = await resolver.users();  // Appeler la méthode users du resolver

      // Vérifier que le résultat correspond à mockUsers et que findAll a été appelé
      expect(result).toBe(mockUsers);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  // Bloc de tests pour la méthode user
  describe('user', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'testuser', password: 'hashedpassword' };

      jest.spyOn(userService, 'findOneById').mockResolvedValue(mockUser);  // Espionner findOneById pour retourner mockUser

      const result = await resolver.user(userId);  // Appeler la méthode user du resolver avec userId

      // Vérifier que le résultat correspond à mockUser et que findOneById a été appelé avec userId
      expect(result).toBe(mockUser);
      expect(userService.findOneById).toHaveBeenCalledWith(userId);
    });
  });
});