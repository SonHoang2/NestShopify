import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './roles/role.entity';
import { Permission } from './users/permission.entity';
import { Action } from './users/action.entity';
import { Article } from './users/article.entity';
import { Comment } from './users/comment.entity';
import { RolesModule } from './roles/roles.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: "mysql",
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'), // Unary plus to convert string to number
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [User, Role, Permission, Action, Article, Comment],
                    synchronize: true, // only run in development
                }
            },
        }),
        UsersModule,
        RolesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }
