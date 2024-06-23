import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionsModule } from './permissions/permissions.module';
import { ResourcesModule } from './resources/resources.module';
import { ActionsService } from './actions/actions.service';
import { ActionsModule } from './actions/actions.module';
import { Role } from './roles/role.entity';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { Resource } from './resources/resource.entity';
import { Permission } from './permissions/permission.entity';
import { Action } from './actions/action.entity';
import { RolePermission } from './role-permissions/rolePermission.entity';



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
                    entities: [User, Role, Resource, Permission, Action, RolePermission],
                    // synchronize: true, // only run in development
                    // dropSchema: true, // only run in development
                }
            },
        }),
        UsersModule,
        RolesModule,
        PermissionsModule,
        ResourcesModule,
        ActionsModule,
        RolePermissionsModule],
    controllers: [AppController, PermissionsController],
    providers: [AppService, PermissionsService, ActionsService],
})

export class AppModule { }
