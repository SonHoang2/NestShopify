import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ItemsService } from 'src/items/items.service';
import { UpdateOrderItemDto } from './dtos/update-order-item.dto';

@Controller('/api/v1/orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
        private itemsService: ItemsService
    ) { }

    @Get('/users/:userId')
    async getAllOrdersByUser(
        @Res() res,
        @Param('userId') userId: number,
    ) {
        try {
            const order = await this.ordersService.getAllOrdersByUser(userId);
            console.log(order);
            res.json({
                status: 'success',
                data: {
                    order,
                },
            });
        } catch (error) {
            console.log({ error });
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/users/:userId')
    async createCart(
        @Res() res,
        @Param('userId') userId: number,
    ) {
        try {
            const order = await this.ordersService.createCart(userId);
            console.log(order);
            res.json({
                status: 'success',
                data: {
                    order,
                },
            });
        } catch (error) {
            console.log({ error });
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/orderItems')
    async createCartItem(
        @Res() res,
        @Body() body: { quantity: number, orderId: number; itemId: number },
    ) {
        try {
            const item = await this.itemsService.getOne(body.itemId);
            
            if (!item) {
                throw new Error('Item not found');
            }

            const order = await this.ordersService.getCart(body.orderId);

            if (!order) {
                throw new Error('Cart not found');
            }

            const orderItem = await this.ordersService.createCartItem(body);
            console.log(orderItem);
            
            res.json({
                status: 'success',
                data: {
                    orderItem,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                data: {
                    status: 'error',
                    message: error.message,
                },
            });
        }
    }

    @Patch('/orderItems/:id')
    async updateCartItem(
        @Res() res,
        @Param('id') id: number,
        @Body() body : UpdateOrderItemDto,
    ) {
        try {
            console.log(id);
            
            const orderItem = await this.ordersService.updateCartItem(id, body.quantity);
            console.log(orderItem);
            
            res.json({
                status: 'success',
                data: {
                    orderItem,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/orderItems/:id')
    async deleteCartItem(
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            const orderItem = await this.ordersService.deleteCartItem(id);
            console.log(orderItem);
            
            res.json({
                status: 'success',
                data: {
                    orderItem,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/:orderId')
    async getCartItems(
        @Res() res,
        @Param('orderId') orderId: number,
    ) {
        try {
            const order = await this.ordersService.getCartItems(orderId);
            console.log(order);
            
            res.json({
                status: 'success',
                data: {
                    order
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/checkout')
    async createCheckout(
        @Res() res
    ) {
        try {
            // just a dummy userId, need to implement authentication
            const userId = 17;

            const order = await this.ordersService.createCheckout(userId);

            res.json({
                status: 'success',
                data: {
                    order
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
