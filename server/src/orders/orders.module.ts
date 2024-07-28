import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Item } from 'src/items/item.entity';
import { ItemsModule } from 'src/items/items.module';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { VouchersModule } from 'src/vouchers/vouchers.module';
import { Voucher } from 'src/vouchers/voucher.entity';
import { FlashSaleItem } from 'src/flash-sales/flash-sale-item.entity';
import { FlashSalesModule } from 'src/flash-sales/flash-sales.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Item, FlashSaleItem]),
        ItemsModule,
        RolesModule,
        PermissionsModule,
        VouchersModule,
        FlashSalesModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule { }
