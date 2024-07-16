import { forwardRef, Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        forwardRef(() => CategoriesModule), 
    ],
    controllers: [ItemsController],
    providers: [ItemsService]
})
export class ItemsModule { }
