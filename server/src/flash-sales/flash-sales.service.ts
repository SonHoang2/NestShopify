import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSale } from './flash-sale.entity';
import { Repository } from 'typeorm';
import { FlashSaleItem } from './flash-sale-item.entity';
import { CreateFlashSaleDto } from './dtos/create-flash-sale.dto';
import { CreateFlashSaleItemDto } from './dtos/create-flash-sale-item.dto';
import { UpdateFlashSaleItemDto } from './dtos/update-flash-sale-item.dto';

@Injectable()
export class FlashSalesService {
    constructor(
        @InjectRepository(FlashSale) private flashSaleRepository: Repository<FlashSale>,
        @InjectRepository(FlashSaleItem) private flashSaleItemRepository: Repository<FlashSaleItem>
    ) { }

    createFlashSale(attrs: CreateFlashSaleDto) {
        const flashSale = this.flashSaleRepository.create(attrs);

        return this.flashSaleRepository.save(flashSale);
    }

    async getFlashSale(id: number) {
        const flashSale = await this.flashSaleRepository.findOneBy({ id });

        if (!flashSale) {
            throw new Error('Flash sale not found');
        }
        return flashSale;
    }

    getAllFlashSales() {
        return this.flashSaleRepository.find();
    }

    async updateFlashSale(id: number, attrs: Partial<CreateFlashSaleDto>) {
        const flashSale = await this.flashSaleRepository.findOneBy({ id });

        if (!flashSale) {
            throw new Error('Flash sale not found');
        }

        Object.assign(flashSale, attrs);

        return this.flashSaleRepository.save(flashSale);
    }

    async deleteFlashSale(id: number) {
        const flashSale = await this.flashSaleRepository.findOneBy({ id });

        if (!flashSale) {
            throw new Error('Flash sale not found');
        }

        return this.flashSaleRepository.remove(flashSale);
    }   

    async createFlashSaleItem(attrs: CreateFlashSaleItemDto) {
        const flashSaleItem = this.flashSaleItemRepository.create(attrs);

        return this.flashSaleItemRepository.save(flashSaleItem);
    }

    getAllFlashSaleItems() {
        return this.flashSaleItemRepository.find();
    }

    async getFlashSaleItem(id: number) {
        const flashSaleItem = await this.flashSaleItemRepository.findOneBy({ id });

        if (!flashSaleItem) {
            throw new Error('Flash sale item not found');
        }
        return flashSaleItem;
    }

    async updateFlashSaleItem(flashSaleItem: FlashSaleItem, attrs: UpdateFlashSaleItemDto) {
        Object.assign(flashSaleItem, attrs);
        console.log(flashSaleItem);
        
        return this.flashSaleItemRepository.save(flashSaleItem);
    }

    async deleteFlashSaleItem (id: number) {
        const flashSaleItem = await this.flashSaleItemRepository.findOneBy({ id });

        if (!flashSaleItem) {
            throw new Error('Flash sale item not found');
        }

        return this.flashSaleItemRepository.remove(flashSaleItem);
    }
}
