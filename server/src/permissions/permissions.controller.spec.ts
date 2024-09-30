import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { ActionsService } from 'src/actions/actions.service';
import { ShareService } from 'src/common/share/share.service';

describe('PermissionsController', () => {
    let controller: PermissionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PermissionsController],
            providers: [
                {
                    provide: PermissionsService,
                    useValue: {},
                },
                {
                    provide: RolesService,
                    useValue: {},
                },
                {
                    provide: ActionsService,
                    useValue: {},
                },
                {
                    provide: ShareService,
                    useValue: {},
                }
            ]
        }).compile();

        controller = module.get<PermissionsController>(PermissionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
