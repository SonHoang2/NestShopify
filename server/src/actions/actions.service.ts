import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './action.entity';

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(Action) private actionRepo: Repository<Action>,
    ) { }

    async create({ action, subject, condition }: { action: string, subject: string, condition: string }) {
        console.log({ action, subject, condition });
        
        const existAction = await this.actionRepo.findOneBy({ name: action, tableName: subject, condition });

        if (existAction) {
            return existAction;
        }

        const newAction = this.actionRepo.create({ name: action, tableName: subject, condition });
        return this.actionRepo.save(newAction);
    }
}
