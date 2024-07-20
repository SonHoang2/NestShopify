import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './roles/role.entity';
import { Permission } from './users/permission.entity';
import { Action } from './users/action.entity';
import { Article } from './users/article.entity';
import { Comment } from './users/comment.entity';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryImage } from './categories/category-image.entity';
import { Category } from './categories/category.entity';
import { ItemsModule } from './items/items.module';
import { Item } from './items/item.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderItems } from './orders/order-item.entity';
import { VouchersModule } from './vouchers/vouchers.module';
import { Voucher } from './vouchers/voucher.entity';
import { FlashSalesModule } from './flash-sales/flash-sales.module';
import { FlashSaleItem } from './flash-sales/flash-sale-item.entity';
import { FlashSale } from './flash-sales/flash-sale.entity';

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
                    type: "mysql",
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'), // Unary plus to convert string to number
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [
                        User, Role, Permission, Action, Article, 
                        Comment, Category, CategoryImage, Item,
                        Order, OrderItems, Voucher, FlashSaleItem,
                        FlashSale
                    ],
                    synchronize: true, // only run in development
                }
            },
        }),
        UsersModule,
        RolesModule,
        CategoriesModule,
        ItemsModule,
        OrdersModule,
        VouchersModule,
        FlashSalesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }
