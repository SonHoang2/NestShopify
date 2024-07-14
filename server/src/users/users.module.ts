import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Permission } from './permission.entity';
import { Action } from './action.entity';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { RolesModule } from 'src/roles/roles.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Permission, Action, Article, Comment]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },
            }),
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.EMAIL_HOST,
                    port: 587,
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
        forwardRef(() => RolesModule), // 'forwardRef' is used to resolve circular dependencies
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService],
})
export class UsersModule { }
