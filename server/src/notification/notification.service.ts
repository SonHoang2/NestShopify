import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { FlashSalesService } from 'src/flash-sales/flash-sales.service';

@Injectable()
export class NotificationService {
    private logger = new Logger(NotificationService.name)

    constructor(
        private usersService: UsersService,
        private MailerService: MailerService,
        private flashSalesService: FlashSalesService
    ) { }

    // Run every hour at 45 minutes
    @Cron('0 45 * * * *')
    async handleCron() {
        const fields = ['id', 'firstName', 'lastName', 'email', 'active'];
        const users = await this.usersService.findAllActiveUser({ fields });
        
        const flashSale = await this.flashSalesService.getUpcomingFlashSale();
        
        console.log(flashSale);
        if (flashSale) {
            users.forEach(user => {
                this.MailerService.sendMail({
                    from: process.env.EMAIL_USERNAME,
                    to: user.email,
                    subject: `Flash Sale Alert!`,
                    html: `<b>Hi ${user.firstName} ${user.lastName}. It time for '${flashSale.description}' flash sale</b>`,
                });
                this.logger.debug(`Sending notification to ${user.firstName} ${user.lastName} at ${user.email}`);
            });
        }
        
        this.logger.debug('Called every hour at 45 minutes');
    }
}
