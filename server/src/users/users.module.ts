import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { CommonModule } from 'src/common/common.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => RolesModule), // 'forwardRef' is used to resolve circular dependencies
        CommonModule,
        PermissionsModule,
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
