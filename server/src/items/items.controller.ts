import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemsService } from './items.service';
import { updateItemDto } from './dtos/update-item.dto';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';


@Controller('/api/v1/items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService,
        private shareService: ShareService
    ) { }

    @Get("/:itemId/images")
    async getImagesByItem(
        @Res() res,
        @Param('itemId') itemId: number
    ) {
        try {
            const images = await this.itemsService.getImagesByItem(itemId);

            return res.json({
                status: 'success',
                data: {
                    images
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get()
    async getAll(
        @Res() res,
        @Query() query: QueryDto
    ) {
        try {
            const newQuery = this.shareService.APIFeatures(query);
            
            const items = await this.itemsService.getAll(newQuery);

            return res.json({
                status: 'success',
                data: {
                    items
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
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
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post()
    async create(
        @Res() res,
        @Body() body: CreateItemDto
    ) {
        try {
            const item = await this.itemsService.create(body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch(':id')
    async update(
        @Res() res,
        @Param('id') id: number,
        @Body() body: updateItemDto
    ) {
        try {
            const item = await this.itemsService.update(id, body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/category/:id')
    async getItemsByCategory(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const items = await this.itemsService.getItemsByCategory(id);

            return res.json({
                status: 'success',
                data: {
                    items
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

}
