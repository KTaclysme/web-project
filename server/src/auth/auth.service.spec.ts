import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Classe mock pour simuler le service des utilisateurs
class MockUsersService {
  // Méthode simulée pour rechercher un utilisateur par nom d'utilisateur
  async findOneByUsername(username: string): Promise<any> {
    // Si le nom d'utilisateur est 'existinguser', retourner un utilisateur fictif avec un mot de passe haché
    if (username === 'existinguser') {
      return { id: 1, username: 'existinguser', password: await bcrypt.hash('password', 10) };
    }
    // Sinon, retourner null
    return null;
  }
}

// Classe mock pour simuler le service JWT
class MockJwtService {
  // Méthode simulée pour signer un payload et retourner un token d'accès fictif
  sign(payload: any): string {
    return 'mockAccessToken';
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Avant chaque test, configurer le module de test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useClass: MockUsersService },
        { provide: JwtService, useClass: MockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // Test pour vérifier que le service est défini
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Bloc de tests pour la méthode validateUser
  describe('validateUser', () => {
    // Test pour vérifier que la méthode retourne l'utilisateur sans le mot de passe avec des identifiants valides
    it('should return user without password when valid credentials are provided', async () => {
      const username = 'existinguser';
      const password = 'password';

      const result = await service.validateUser(username, password);
      expect(result).toBeDefined();
      expect(result.id).toEqual(1);
      expect(result.username).toEqual('existinguser');
      expect(result.password).toBeUndefined();
    });

    // Test pour vérifier que la méthode retourne null avec des identifiants invalides
    it('should return null when invalid credentials are provided', async () => {
      const username = 'nonexistentuser';
      const password = 'invalidpassword';

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
    });
  });

  // Bloc de tests pour la méthode login
  describe('login', () => {
    // Test pour vérifier que la méthode retourne un objet avec un token d'accès pour un utilisateur valide
    it('should return an object with access_token when valid user is provided', async () => {
      const user = { id: 1, username: 'existinguser' };
      const expectedResult = { access_token: 'mockAccessToken' };

      // Espionner la méthode sign du service JWT pour retourner un token d'accès fictif
      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'mockAccessToken');

      const result = await service.login(user);
      expect(result).toEqual(expectedResult);
    });
  });
});