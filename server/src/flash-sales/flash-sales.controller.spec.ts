import { Test, TestingModule } from '@nestjs/testing';
import { FlashSalesController } from './flash-sales.controller';
import { FlashSalesService } from './flash-sales.service';
import { ItemsService } from 'src/items/items.service';

describe('FlashSalesController', () => {
    let controller: FlashSalesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FlashSalesController],
            providers: [
                {
                    provide: FlashSalesService,
                    useValue: {},
                },
                {
                    provide: ItemsService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<FlashSalesController>(FlashSalesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
