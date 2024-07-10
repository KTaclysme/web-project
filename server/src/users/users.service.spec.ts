import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Avant chaque test, configurer le module de test
  beforeEach(async () => {
    // Créer un module de test avec UsersService et un PrismaService mocké
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),    // Mock de la méthode create du service Prisma pour l'entité 'user'
              findMany: jest.fn(),  // Mock de la méthode findMany du service Prisma pour l'entité 'user'
              findUnique: jest.fn(),// Mock de la méthode findUnique du service Prisma pour l'entité 'user'
            },
          },
        },
      ],
    }).compile();

    // Récupérer les instances du UsersService et du PrismaService
    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // Test pour vérifier que le UsersService est correctement défini
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Bloc de tests pour la méthode create
  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const data = { username: 'testuser', password: 'testpass' };
      const hashedPassword = 'hashedPassword'; // Valeur de hachage fixe pour les tests
      const user = { id: 1, username: data.username, password: hashedPassword };

      // Espionner la fonction hash de bcrypt pour retourner une valeur de hachage fixe
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      // Espionner la méthode create du PrismaService pour retourner l'utilisateur créé
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      // Appeler la méthode create du UsersService et vérifier le résultat
      expect(await service.create(data)).toEqual(user);
      // Vérifier que la méthode create du PrismaService a été appelée avec les bonnes données
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: data.username,
          password: hashedPassword,
        },
      });
    });
  });

  // Bloc de tests pour la méthode findAll
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, username: 'testuser1', password: 'testpass1' },
        { id: 2, username: 'testuser2', password: 'testpass2' },
      ];

      // Espionner la méthode findMany du PrismaService pour retourner un tableau d'utilisateurs
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      // Appeler la méthode findAll du UsersService et vérifier le résultat
      expect(await service.findAll()).toEqual(users);
      // Vérifier que la méthode findMany du PrismaService a été appelée
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  // Bloc de tests pour la méthode findOneById
  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = { id: userId, username: 'testuser', password: 'testpass' };

      // Espionner la méthode findUnique du PrismaService pour retourner un utilisateur
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      // Appeler la méthode findOneById du UsersService avec userId et vérifier le résultat
      expect(await service.findOneById(userId)).toEqual(user);
      // Vérifier que la méthode findUnique du PrismaService a été appelée avec les bons paramètres
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should return null if user is not found', async () => {
      // Simuler que findUnique du PrismaService retourne null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Appeler la méthode findOneById du UsersService avec un ID inexistant et vérifier le résultat
      expect(await service.findOneById(99)).toBeNull();
      // Vérifier que la méthode findUnique du PrismaService a été appelée avec les bons paramètres
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });

  // Bloc de tests pour la méthode findOneByUsername
  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const user = { id: 1, username: username, password: 'testpass' };

      // Espionner la méthode findUnique du PrismaService pour retourner un utilisateur
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      // Appeler la méthode findOneByUsername du UsersService avec username et vérifier le résultat
      expect(await service.findOneByUsername(username)).toEqual(user);
      // Vérifier que la méthode findUnique du PrismaService a été appelée avec les bons paramètres
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: username } });
    });

    it('should return null if user is not found', async () => {
      // Simuler que findUnique du PrismaService retourne null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Appeler la méthode findOneByUsername du UsersService avec un nom d'utilisateur inexistant et vérifier le résultat
      expect(await service.findOneByUsername('unknownuser')).toBeNull();
      // Vérifier que la méthode findUnique du PrismaService a été appelée avec les bons paramètres
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: 'unknownuser' } });
    });
  });
});