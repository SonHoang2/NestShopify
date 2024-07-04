import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { Action } from './action.entity';
import { Article } from './article.entity';
import { Comment } from './comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Permission, Role, Action, Article, Comment]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },

            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService]
})
export class UsersModule { }
