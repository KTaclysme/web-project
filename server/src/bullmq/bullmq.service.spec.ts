import { Test, TestingModule } from '@nestjs/testing';
import { BullMQService } from './bullmq.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomWebSocketGateway } from '../websockets/websockets.gateway';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';

describe('BullMQService', () => {
    let service: BullMQService; // Instance du service BullMQService
    let prismaService: PrismaService; // Instance du service PrismaService (mocké)
    let webSocketGateway: CustomWebSocketGateway; // Instance du CustomWebSocketGateway (mocké)
    let messageQueue: Queue; // Instance de la file d'attente (mockée)

    beforeEach(async () => {
        // Création du module de test
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BullMQService, // Le service à tester
                {
                    provide: PrismaService, // Fournisseur du service PrismaService
                    useValue: {
                        message: {
                            create: jest.fn().mockResolvedValue({ id: 1, fromUserId: 1, toUserId: 2, content: 'test message' }), // Mock de la méthode create de PrismaService
                        },
                    },
                },
                {
                    provide: CustomWebSocketGateway, // Fournisseur du CustomWebSocketGateway
                    useValue: {
                        server: {
                            to: jest.fn().mockReturnThis(), // Mock de la méthode to du serveur websocket
                            emit: jest.fn(), // Mock de la méthode emit du serveur websocket
                        },
                    },
                },
                {
                    provide: getQueueToken('messages'), // Fournisseur de la file d'attente avec le token 'messages'
                    useValue: {
                        add: jest.fn(), // Mock de la méthode add de la file d'attente
                    },
                },
            ],
        }).compile(); // Compilation du module de test

        // Récupération des instances mockées
        service = module.get<BullMQService>(BullMQService);
        prismaService = module.get<PrismaService>(PrismaService);
        webSocketGateway = module.get<CustomWebSocketGateway>(CustomWebSocketGateway);
        messageQueue = module.get<Queue>(getQueueToken('messages'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined(); // Vérification que le service est défini
    });

    describe('sendMessage', () => {
        it('should add a job to the message queue', async () => {
            // Appel de la méthode sendMessage du service
            await service.sendMessage(1, 2, 'test message');

            // Vérification que la méthode add de la file d'attente a été appelée avec les bons paramètres
            expect(messageQueue.add).toHaveBeenCalledWith('send', {
                fromUserId: 1,
                toUserId: 2,
                content: 'test message',
            });
        });
    });

    describe('handleMessageJob', () => {
        it('should create a message and emit it to the websocket', async () => {
            const job = {
                data: {
                    fromUserId: 1,
                    toUserId: 2,
                    content: 'test message',
                },
            };

            // Appel de la méthode handleMessageJob du service
            await service.handleMessageJob(job);

            // Vérification que la méthode create de PrismaService a été appelée avec les bons paramètres
            expect(prismaService.message.create).toHaveBeenCalledWith({
                data: job.data,
            });

            // Vérification que la méthode to du serveur websocket a été appelée avec le bon argument
            expect(webSocketGateway.server.to).toHaveBeenCalledWith('user-2');

            // Vérification que la méthode emit du serveur websocket a été appelée avec les bons paramètres
            expect(webSocketGateway.server.emit).toHaveBeenCalledWith('receiveMessage', expect.any(Object));
        });
    });
});