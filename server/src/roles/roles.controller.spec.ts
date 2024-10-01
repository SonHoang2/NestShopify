import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JwtService } from '@nestjs/jwt';
import { PermissionsService } from 'src/permissions/permissions.service';

describe('RolesController', () => {
    let controller: RolesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                {
                    provide: RolesService,
                    useValue: {},
                },
                {
                    provide: JwtService,
                    useValue: {},
                },
                {
                    provide: PermissionsService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<RolesController>(RolesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
