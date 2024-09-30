import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ShareService } from 'src/common/share/share.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';

describe('ItemsController', () => {
    let controller: ItemsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ItemsController],
            providers: [
                {
                    provide: ItemsService,
                    useValue: {},
                },
                {
                    provide: ShareService,
                    useValue: {},
                },
                {
                    provide: PermissionsService,
                    useValue: {},
                },
                {
                    provide: RolesService,
                    useValue: {},
                }
            ]
        }).compile();

        controller = module.get<ItemsController>(ItemsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
