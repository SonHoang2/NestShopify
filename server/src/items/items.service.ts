import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item) private itemRepo: Repository<Item>,
    ) { }

    async createItem(item) {
        const newItem = this.itemRepo.create(item);
        return this.itemRepo.save(newItem);
    }

    async getAll() {
        return this.itemRepo.find();
    }

    async getOne(id: number) {
        return this.itemRepo.findOneBy({ id });
    }

    async update(id: number, attrs) {
        const item = await this.getOne(id);
        
        if (!item) {
            throw new Error('Item not found');
        }

        Object.assign(item, attrs);
        return this.itemRepo.save(item);
    }
}
