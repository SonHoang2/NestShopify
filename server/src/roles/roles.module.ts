import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService],
})
export class RolesModule { }
