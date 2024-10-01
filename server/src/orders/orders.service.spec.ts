import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrderItem } from './order-item.entity';
import { Item } from 'src/items/item.entity';
import { VouchersService } from 'src/vouchers/vouchers.service';
import { FlashSaleItem } from 'src/flash-sales/flash-sale-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';

describe('OrdersService', () => {
    let service: OrdersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: VouchersService,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Order),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(OrderItem),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Item),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(FlashSaleItem),
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
