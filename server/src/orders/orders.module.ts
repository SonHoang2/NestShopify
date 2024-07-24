import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Item } from 'src/items/item.entity';
import { ItemsModule } from 'src/items/items.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Item]),
        ItemsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule { }
