import { forwardRef, Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, User]),
        JwtModule,
        forwardRef(() => UsersModule), // 'forwardRef' is used to resolve circular dependencies
        forwardRef(() => PermissionsModule), // 'forwardRef' is used to resolve circular dependencies
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService]
})
export class RolesModule { }
