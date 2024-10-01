import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemImage } from './item-image.entity';

describe('ItemsService', () => {
    let service: ItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemsService,
                {
                    provide: getRepositoryToken(Item),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(ItemImage),
                    useValue: {},
                }
            ],
        }).compile();

        service = module.get<ItemsService>(ItemsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
