import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ItemsService } from 'src/items/items.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { VouchersService } from 'src/vouchers/vouchers.service';

describe('OrdersController', () => {
    let controller: OrdersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: {},
                },
                {
                    provide: ItemsService,
                    useValue: {},
                },
                {
                    provide: PermissionsService,
                    useValue: {},
                },
                {
                    provide: RolesService,
                    useValue: {},
                },
                {
                    provide: VouchersService,
                    useValue: {},
                }
            ]
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
