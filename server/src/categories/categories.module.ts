import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryImage } from './category-image.entity';
import { ItemsModule } from 'src/items/items.module';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, CategoryImage]),
        forwardRef(() => ItemsModule),
        RolesModule,
        PermissionsModule
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule { }
