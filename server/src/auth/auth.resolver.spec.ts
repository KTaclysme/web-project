import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { UserType } from '../users/dto/user.type';
import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;

  // Avant chaque test, configurer le module de test
  beforeEach(async () => {
    // Mock du AuthService avec des fonctions Jest mockées
    const mockAuthService = {
      validateUser: jest.fn() as jest.MockedFunction<(username: string, pass: string) => Promise<any>>,
      login: jest.fn() as jest.MockedFunction<(user: any) => Promise<AuthType>>,
    };

    // Mock du UsersService avec des fonctions Jest mockées
    const mockUsersService = {
      create: jest.fn() as jest.MockedFunction<(data: AuthInput) => Promise<UserType>>,
    };

    // Configuration du module de test avec les mocks
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  // Test pour vérifier que le resolver est défini
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Bloc de tests pour la méthode login
  describe('login', () => {
    // Test pour vérifier que la méthode login retourne un AuthType si les informations d'identification sont valides
    it('should return an AuthType if credentials are valid', async () => {
      const authInput: AuthInput = { username: 'test', password: 'test' };
      const user = { id: 1, username: 'test', password: 'test' };
      const authType: AuthType = { access_token: 'token' };

      // Simuler les valeurs de retour des fonctions mockées
      (authService.validateUser as jest.Mock).mockResolvedValue(user);
      (authService.login as jest.Mock).mockResolvedValue(authType);

      // Appeler la méthode login du resolver et vérifier le résultat
      const result = await resolver.login(authInput);
      expect(result).toEqual(authType);
      expect(authService.validateUser).toHaveBeenCalledWith('test', 'test');
      expect(authService.login).toHaveBeenCalledWith(user);
    });

    // Test pour vérifier que la méthode login lance une UnauthorizedException si les informations d'identification sont invalides
    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const authInput: AuthInput = { username: 'test', password: 'test' };

      // Simuler la valeur de retour de la fonction mockée
      (authService.validateUser as jest.Mock).mockResolvedValue(null);

      // Vérifier que la méthode login du resolver lance une exception
      await expect(resolver.login(authInput)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('test', 'test');
    });
  });

  // Bloc de tests pour la méthode signup
  describe('signup', () => {
    // Test pour vérifier que la méthode signup crée un nouvel utilisateur et retourne un UserType
    it('should create a new user and return UserType', async () => {
      const authInput: AuthInput = { username: 'test', password: 'test' };
      const userType: UserType = { id: 1, username: 'test', password: 'test' };

      // Simuler la valeur de retour de la fonction mockée
      (usersService.create as jest.Mock).mockResolvedValue(userType);

      // Appeler la méthode signup du resolver et vérifier le résultat
      const result = await resolver.signup(authInput);
      expect(result).toEqual(userType);
      expect(usersService.create).toHaveBeenCalledWith(authInput);
    });
  });
});