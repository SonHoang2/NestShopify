import { Test, TestingModule } from '@nestjs/testing';
import { VouchersService } from './vouchers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';

describe('VouchersService', () => {
    let service: VouchersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VouchersService,
                {
                    provide: getRepositoryToken(Voucher),
                    useValue: {},
                }
            ],
        }).compile();

        service = module.get<VouchersService>(VouchersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
