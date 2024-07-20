import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSale } from './flash-sale.entity';
import { Repository } from 'typeorm';
import { FlashSaleItem } from './flash-sale-item.entity';

@Injectable()
export class FlashSalesService {
    constructor(
        @InjectRepository(FlashSale) private flashSaleRepository: Repository<FlashSale>,
        @InjectRepository(FlashSaleItem) private flashSaleItemRepository: Repository<FlashSaleItem>
    ) {}
    
    async createFlashSale() {
        const flashSale = await this.flashSaleRepository.create();

        return this.flashSaleRepository.save(flashSale);
    }
}
