import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Action } from './action.entity';

describe('ActionsService', () => {
    let service: ActionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActionsService,
                {
                    provide: getRepositoryToken(Action),
                    useValue: {
                        // Mock implementation of ActionRepository methods
                        create: jest.fn().mockResolvedValue([]),
                        findOneBy: jest.fn().mockResolvedValue({}),
                        save: jest.fn().mockResolvedValue({}),
                    },
                },
            ],
        }).compile();

        service = module.get<ActionsService>(ActionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
