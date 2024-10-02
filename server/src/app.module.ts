import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './roles/role.entity';
import { Permission } from './permissions/permission.entity';

import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryImage } from './categories/category-image.entity';
import { Category } from './categories/category.entity';
import { ItemsModule } from './items/items.module';
import { Item } from './items/item.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

import { FlashSalesModule } from './flash-sales/flash-sales.module';
import { FlashSaleItem } from './flash-sales/flash-sale-item.entity';
import { FlashSale } from './flash-sales/flash-sale.entity';
import { ItemImage } from './items/item-image.entity';
import { Action } from './actions/action.entity';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ActionsModule } from './actions/actions.module';
import { Voucher } from './vouchers/voucher.entity';
import { VouchersModule } from './vouchers/vouchers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';

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
                    type: "postgres",
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'), // Unary plus to convert string to number
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [
                        User, Role, Permission, Action,
                        Category, CategoryImage, Item,
                        ItemImage, Order, OrderItem, Voucher,
                        FlashSaleItem, FlashSale, Permission,
                        Action
                    ],
                    // synchronize: true, // only run in development
                }
            },
        }),
        ScheduleModule.forRoot(),
        UsersModule,
        RolesModule,
        CategoriesModule,
        ItemsModule,
        OrdersModule,
        VouchersModule,
        FlashSalesModule,
        CommonModule,
        AuthModule,
        PermissionsModule,
        ActionsModule,
        NotificationModule,
    ],
})

export class AppModule { }
