import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { FlashSalesModule } from 'src/flash-sales/flash-sales.module';

@Module({
    imports: [
        UsersModule,
        FlashSalesModule,
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.EMAIL_HOST,
                    port: Number(process.env.EMAIL_PORT),
                    secure: false, // upgrade later with STARTTLS
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                },
                template: {
                    dir: __dirname + '/templates',
                    // adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [NotificationService]
})
export class NotificationModule { }
