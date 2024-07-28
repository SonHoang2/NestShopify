import { forwardRef, Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemImage } from './item-image.entity';
import { CommonModule } from 'src/common/common.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item, ItemImage]),
        forwardRef(() => CategoriesModule), 
        CommonModule,
        PermissionsModule,
        RolesModule
    ],
    controllers: [ItemsController],
    providers: [ItemsService],
    exports: [ItemsService],
})
export class ItemsModule { }
