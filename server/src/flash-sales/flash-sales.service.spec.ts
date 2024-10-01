import { Test, TestingModule } from '@nestjs/testing';
import { FlashSalesService } from './flash-sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FlashSale } from './flash-sale.entity';
import { FlashSaleItem } from './flash-sale-item.entity';

describe('FlashSalesService', () => {
    let service: FlashSalesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FlashSalesService,
                {
                    provide: getRepositoryToken(FlashSale),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(FlashSaleItem),
                    useValue: {},
                }
            ],
        }).compile();

        service = module.get<FlashSalesService>(FlashSalesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
