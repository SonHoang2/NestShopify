import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ItemsService } from 'src/items/items.service';
import { UpdateOrderItemDto } from './dtos/update-order-item.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Action, CartStatus, Subject } from 'src/common/variable';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { VouchersService } from 'src/vouchers/vouchers.service';

@Controller('/api/v1')
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
        private itemsService: ItemsService,
        private rolesService: RolesService,
        private permissionsService: PermissionsService,
        private vouchersService: VouchersService,
    ) { }

    @Get('/orders')
    async getAllOrders(
        @Res() res,
        @Req() req
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Orders);

            if (permission.condition === "author") {
                throw new Error('Permission denied');
            }


            const orders = await this.ordersService.getAllOrders();
            res.json({
                status: 'success',
                data: {
                    orders,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/orders/users/:userId')
    async getAllOrdersByUser(
        @Res() res,
        @Req() req,
        @Param('userId') userId: number,
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Orders);

            if (permission.condition === "author") {
                throw new Error('Permission denied');
            }

            const order = await this.ordersService.getAllOrdersByUser(userId);
            console.log(order);
            res.json({
                status: 'success',
                data: {
                    order,
                },
            });
        } catch (error) {

            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/carts')
    async getAllCarts(
        @Res() res,
        @Req() req,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Orders);

            if (permission.condition === "author") {
                const order = await this.ordersService.findCartByUser(userId);
                if (order.userId !== userId) {
                    throw new Error('Permission denied');
                }
            }

            const carts = await this.ordersService.getAllCarts();
            res.json({
                status: 'success',
                data: {
                    carts,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/carts')
    async createCart(
        @Res() res,
        @Req() req,
    ) {
        try {
            // no need acl
            const { userId } = await this.rolesService.getRoleAndUserId(req);

            const cart = await this.ordersService.createCart(userId);

            res.json({
                status: 'success',
                data: {
                    cart,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/cart/cartItems')
    async createCartItem(
        @Res() res,
        @Req() req,
        @Body() body: CreateCartItemDto,
    ) {
        try {
            const { userId } = await this.rolesService.getRoleAndUserId(req);

            // find cart id by user id
            const cart = await this.ordersService.findCartByUser(userId);

            console.log(cart);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const item = await this.itemsService.getOne(body.itemId);

            if (!item) {
                throw new Error('Item not found');
            }

            const cartItem = await this.ordersService.createCartItem({ orderId: cart.id, ...body });
            console.log(cartItem);

            res.json({
                status: 'success',
                data: {
                    cartItem,
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

    @Patch('/cart/cartItems/:cartItemId')
    async updateCartItem(
        @Res() res,
        @Req() req,
        @Param('cartItemId') cartItemId: number,
        @Body() body: UpdateOrderItemDto,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Orders);

            if (permission.condition === "author") {
                const order = await this.ordersService.getOrderByOrderItem(cartItemId);
                if (order.userId !== userId) {
                    throw new Error('Permission denied');
                }
            }

            const cartItems = await this.ordersService.updateCartItem(cartItemId, body.quantity);

            res.json({
                status: 'success',
                data: {
                    cartItems,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/cart/cartItems/:cartItemId')
    async deleteCartItem(
        @Res() res,
        @Req() req,
        @Param('cartItemId') cartItemId: number,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Orders);

            if (permission.condition === "author") {
                const order = await this.ordersService.getOrderByOrderItem(cartItemId);
                if (order.userId !== userId) {
                    throw new Error('Permission denied');
                }
            }

            const cartItems = await this.ordersService.deleteCartItem(cartItemId);
            console.log(cartItems);

            res.json({
                status: 'success',
                data: {
                    cartItems,
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/cart/:cartId')
    async getCartItems(
        @Res() res,
        @Req() req,
        @Param('cartId') cartId: number,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Orders);

            if (permission.condition === "author") {
                const order = await this.ordersService.getCart(cartId);
                if (order?.userId !== userId) {
                    throw new Error('Permission denied');
                }
            }

            const cartItems = await this.ordersService.getCartItems(cartId);

            res.json({
                status: 'success',
                data: {
                    cartItems
                },
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/cart/voucher/:code')
    async applyVoucher(
        @Res() res,
        @Req() req,
        @Param('code') code: string,
    ) {
        try {
            const { userId } = await this.rolesService.getRoleAndUserId(req);

            // only allow completed cart to apply voucher
            const cart = await this.ordersService.findCartByUser(userId);

            if (cart.status !== CartStatus.Completed) {
                throw new Error('Cart is not completed yet');
            }

            // validate voucher
            const voucher = await this.vouchersService.validate({ code });

            const order = await this.ordersService.applyVoucher(cart, voucher.id, voucher.discount);

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

    @Get('/carts/pay')
    async payCart(
        @Res() res,
        @Req() req,
    ) {
        try {
            const { userId } = await this.rolesService.getRoleAndUserId(req);

            const cart = await this.ordersService.findCartByUser(userId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const total = await this.ordersService.completeCart(cart.id, CartStatus.Completed);

            res.json({
                status: 'success',
                data: {
                    total
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
        @Res() res,
        @Req() req
    ) {
        try {
            const { userId } = await this.rolesService.getRoleAndUserId(req);

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

    @Get('/orders/reports/month/:month/year/:year')
    async getReportByMonthAndYear(
        @Res() res,
        @Req() req,
        @Param('month') month: number,
        @Param('year') year: number,
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Orders);

            if (permission.condition === "author") {
                throw new Error('Permission denied');
            }

            const report = await this.ordersService.getReportByMonthAndYear(month, year);

            res.json({
                status: 'success',
                data: {
                    report
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
