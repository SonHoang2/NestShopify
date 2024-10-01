import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { FlashSalesService } from 'src/flash-sales/flash-sales.service';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: UsersService,
                    useValue: {},
                },
                {
                    provide: MailerService,
                    useValue: {},
                },
                {
                    provide: FlashSalesService,
                    useValue: {},
                }
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
