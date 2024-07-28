import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemImage } from './item-image.entity';
import { CreateItemDto } from './dtos/create-item.dto';


@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        @InjectRepository(ItemImage) private itemImageRepo: Repository<ItemImage>
    ) { }

    async create(item: CreateItemDto) {
        const newItem = this.itemRepo.create(item);
        return this.itemRepo.save(newItem);
    }

    async getAll({ fields, offset, limit, sort }: { fields: [], offset: number, limit: number, sort: {} }) {
        return this.itemRepo.find({
            select: fields,
            skip: offset,
            take: limit,
            order: sort
        })
    }

    async getOne(id: number) {
        const item = await this.itemRepo.findOneBy({ id })
        
        if (!item) {
            throw new Error('not found item');
        }

        return item;
    }

    async update(id: number, attrs) {
        const item = await this.getOne(id);

        if (!item) {
            throw new Error('Item not found');
        }

        Object.assign(item, attrs);
        return this.itemRepo.save(item);
    }

    async getItemsByCategory(categoryId: number) {
        return this.itemRepo.createQueryBuilder('item')
            .select('*')
            .where('item.categoryId = :categoryId', { categoryId })
            .getRawMany();
    }

    async getImagesByItem(itemId: number) {
        return this.itemImageRepo.createQueryBuilder('item_images')
            .select('*')
            .where('item_images.item = :itemId', { itemId })
            .getRawMany();
    }

    async delete(id: number) {
        const item = await this.getOne(id);

        if (!item) {
            throw new Error('Item not found');
        }

        return this.itemRepo.delete(item);
    }
}
