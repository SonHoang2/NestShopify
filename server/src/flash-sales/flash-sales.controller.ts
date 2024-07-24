import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { CreateFlashSaleDto } from './dtos/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dtos/update-flash-sale.dto';
import { CreateFlashSaleItemDto } from './dtos/create-flash-sale-item.dto';
import { ItemsService } from 'src/items/items.service';
import { UpdateFlashSaleItemDto } from './dtos/update-flash-sale-item.dto';

@Controller('/api/v1/flash-sales')
export class FlashSalesController {
    constructor(
        private flashSalesService: FlashSalesService,
        private itemsService: ItemsService
    ) { }
    // flash sale item
    @Get('/items')
    async getAllFlashSaleItems(
        @Res() res
    ) {
        try {
            const flashSaleItems = await this.flashSalesService.getAllFlashSaleItems();
            console.log("hello", flashSaleItems);
            
            return res.json({
                status: 'success',
                data: {
                    flashSaleItems
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
            
        }
    }
    
    @Get('/items/:id')
    async getFlashSaleItem(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const flashSaleItem = await this.flashSalesService.getFlashSaleItem(id);
            
            return res.json({
                status: 'success',
                data: {
                    flashSaleItem
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }
    
    @Post('/items')
    async createFlashSaleItem(
        @Res() res,
        @Body() Body: CreateFlashSaleItemDto,
    ) {
        try {
            // Check if item exists
            const item = await this.itemsService.getOne(Body.itemId);

            if (!item) {
                throw new Error('Item not found');
            }

            // quantity item flash sale is <= stock
            const stock = item.quantity;
            if (Body.quantity > stock) {
                throw new Error(`you cannot flash sale more than stock (stock quantity: ${stock})`);
            }

            // price item flash sale is < sale price
            if (Body.price >= item.salePrice) {
                throw new Error(`Flash sale price cannot be greater than or equal to the sale price (sale price: ${item.salePrice})`);
            }

            // Check if flash sale exists
            const flashSale = await this.flashSalesService.getFlashSale(Body.flashSaleId);

            if (!flashSale) {
                throw new Error('Flash sale not found');
            }

            const flashSaleItem = await this.flashSalesService.createFlashSaleItem(Body);

            return res.json({
                status: 'success',
                data: {
                    flashSaleItem
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }
    @Patch('/items/:id')
    async updateFlashSaleItem(
        @Res() res,
        @Param('id') id: number,
        @Body() body: UpdateFlashSaleItemDto
    ) {
        try {
            // Check if flash sale item exists
            const flashSaleItem = await this.flashSalesService.getFlashSaleItem(id);

            // get item
            const item = await this.itemsService.getOne(flashSaleItem.itemId);

            if (!item) {
                throw new Error('Item not found');
            }

            // quantity item flash sale is <= stock
            const stock = item.quantity;
            
            if (body.quantity > stock) {
                throw new Error(`you cannot flash sale more than stock (stock quantity: ${stock})`);
            }

            // price item flash sale is < sale price
            if (body.price >= item.salePrice) {
                throw new Error(`Flash sale price cannot be greater than or equal to the sale price (sale price: ${item.salePrice})`);
            }

            const newFlashSaleItem = await this.flashSalesService.updateFlashSaleItem(flashSaleItem, body);

            return res.json({
                status: 'success',
                data: {
                    newFlashSaleItem
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/items/:id')
    async deleteFlashSaleItem(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const flashSaleItem = await this.flashSalesService.deleteFlashSaleItem(id);

            return res.json({
                status: 'success',
                data: {
                    flashSaleItem
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // flash sale
    @Post()
    async createFlashSale(
        @Res() res,
        @Body() body: CreateFlashSaleDto
    ) {
        try {
            const flashSale = await this.flashSalesService.createFlashSale(body);

            return res.json({
                status: 'success',
                data: {
                    flashSale
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/:id')
    async getFlashSale(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const flashSale = await this.flashSalesService.getFlashSale(id);

            return res.json({
                status: 'success',
                data: {
                    flashSale
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
    async getAllFlashSales(
        @Res() res
    ) {
        try {
            const flashSales = await this.flashSalesService.getAllFlashSales();

            return res.json({
                status: 'success',
                data: {
                    flashSales
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:id')
    async updateFlashSale(
        @Res() res,
        @Param('id') id: number,
        @Body() body: UpdateFlashSaleDto
    ) {
        try {
            console.log(body);

            const flashSale = await this.flashSalesService.updateFlashSale(id, body);

            return res.json({
                status: 'success',
                data: {
                    flashSale
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async deleteFlashSale(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const flashSale = await this.flashSalesService.deleteFlashSale(id);

            return res.json({
                status: 'success',
                data: {
                    flashSale
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
