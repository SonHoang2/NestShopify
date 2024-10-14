import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';


@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '10h' },
            }),
            inject: [ConfigService],
        }),
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
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
