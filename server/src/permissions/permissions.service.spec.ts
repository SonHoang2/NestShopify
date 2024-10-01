import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from './permission.entity';

describe('PermissionsService', () => {
    let service: PermissionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionsService,
                {
                    provide: getRepositoryToken(Permission),
                    useValue: {}
                }

            ],
        }).compile();

        service = module.get<PermissionsService>(PermissionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
