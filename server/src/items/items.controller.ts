import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemsService } from './items.service';
import { updateItemDto } from './dtos/update-item.dto';

@Controller('/api/v1/items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService
    ) { }

    @Get()
    async getAll(
        @Res() res
    ) {
        try {
            const items = await this.itemsService.getAll();

            return res.json({
                status: 'success',
                data: {
                    items
                },
            });
        } catch (error) {
            return res.json({
                status: 'success',
                data: {
                    status: 'error',
                    message: error.message,
                },
            });       
        }
    }

    @Get(':id')
    async getOne(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const item = await this.itemsService.getOne(id);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.json({
                status: 'success',
                data: {
                    status: 'error',
                    message: error.message,
                },
            });
        }
    }

    @Post()
    async create(
        @Res() res,
        @Body() body: CreateItemDto
    ) {
        try {
            const item = await this.itemsService.createItem(body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.json({
                status: 'success',
                data: {
                    status: 'error',
                    message: error.message,
                },
            });
        }
    }

    @Patch(':id')
    async update(
        @Res() res,
        @Param('id') id: number,
        @Body() body : updateItemDto
    ) {
        try {
            console.log(body);
            
            const item = await this.itemsService.update(id, body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.json({
                status: 'success',
                data: {
                    status: 'error',
                    message: error.message,
                },
            });
        }
    }
}
