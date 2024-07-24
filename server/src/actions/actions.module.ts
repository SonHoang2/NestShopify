import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from './action.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Action])
    ],
    controllers: [ActionsController],
    providers: [ActionsService],
    exports: [ActionsService]
})
export class ActionsModule { }
