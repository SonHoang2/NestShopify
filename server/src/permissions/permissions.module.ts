import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { RolesModule } from 'src/roles/roles.module';
import { ActionsModule } from 'src/actions/actions.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Permission]),
        RolesModule,
        ActionsModule,
        CommonModule
    ],
    controllers: [PermissionsController],
    providers: [PermissionsService],
    exports: [PermissionsService]
})
export class PermissionsModule { }
