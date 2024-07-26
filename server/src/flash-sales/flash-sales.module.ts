import { Module } from '@nestjs/common';
import { FlashSalesController } from './flash-sales.controller';
import { FlashSalesService } from './flash-sales.service';
import { FlashSaleItem } from './flash-sale-item.entity';
import { FlashSale } from './flash-sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FlashSale, FlashSaleItem]),
        ItemsModule
    ],
    controllers: [FlashSalesController],
    providers: [FlashSalesService],
    exports: [FlashSalesService]
})
export class FlashSalesModule { }
