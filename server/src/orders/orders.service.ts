import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Item } from 'src/items/item.entity';
import { VouchersService } from 'src/vouchers/vouchers.service';
import { FlashSaleItem } from 'src/flash-sales/flash-sale-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        private voucherService: VouchersService,
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem) private OrderItemRepo: Repository<OrderItem>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        @InjectRepository(FlashSaleItem) private flashSaleItems: Repository<FlashSaleItem>
    ) { }

    getAllOrders() {
        return this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('createdAt IS NOT NULL')
            .getRawMany();
    }

    getAllOrdersByUser(userId: number) {
        return this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('orders.userId = :userId AND createdAt IS NOT NULL', { userId })
            .getRawMany();
    }

    findCartByUser(userId: number) {
        return this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('orders.userId = :userId AND createdAt IS NULL', { userId })
            .getRawOne();
    }

    async getCart(id: number) {
        return await this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('orders.id = :id AND createdAt IS NULL', { id })
            .getRawOne();
    }

    async createCart(userId: number) {
        const order = await this.findCartByUser(userId);

        if (order) {
            return order;
        }

        const newOrder = this.orderRepo.create({ userId });

        return await this.orderRepo.save(newOrder);
    }

    async completeCart(cartId: number, status: string) {
        await this.orderRepo.update({ id: cartId }, { status });

        const total = await this.OrderItemRepo.createQueryBuilder('order_items')
            .select('SUM(totalAmount) as total')
            .where('order_items.orderId = :cartId', { cartId })
            .getRawOne();

        return this.orderRepo.save({ id: cartId, totalAmount: total.total });
    }

    async createCartItem({ orderId, itemId, quantity }: { orderId: number; itemId: number; quantity: number }) {
        const CartItem = this.OrderItemRepo.create({ orderId, itemId, quantity });

        const item = await this.itemRepo.createQueryBuilder('items')
            .select('salePrice as price, quantity')
            .where('items.id = :itemId', { itemId })
            .getRawOne();

        if (quantity <= 0 || quantity > item.quantity) {
            throw new Error('Invalid quantity');
        }

        const totalAmount = item.price * quantity;
        Object.assign(CartItem, { totalAmount });

        const orderItem = await this.OrderItemRepo.save(CartItem);

        // Update total amount in order
        this.sumCart(orderId)

        return orderItem;
    }

    async updateCartItem(id: number, quantity: number) {
        const orderItem = await this.OrderItemRepo.findOneBy({ id });

        if (!orderItem) {
            throw new Error('Order item not found');
        }

        const item = await this.itemRepo.createQueryBuilder('items')
            .select('salePrice as price, quantity')
            .where('items.id = :itemId', { itemId: orderItem.itemId })
            .getRawOne();

        if (quantity <= 0 || quantity > item.quantity) {
            throw new Error('Invalid quantity');
        }

        const totalAmount = item.price * quantity;

        Object.assign(orderItem, { quantity, totalAmount });

        const newOrderItem = await this.OrderItemRepo.save(orderItem)

        // Update total amount in order
        this.sumCart(orderItem.orderId);

        return newOrderItem;
    }

    async deleteCartItem(id: number) {
        const orderItem = await this.OrderItemRepo.findOneBy({ id });

        if (!orderItem) {
            throw new Error('Order item not found');
        }

        const newOrderItem = await this.OrderItemRepo.remove(orderItem);

        // Update total amount in order
        this.sumCart(orderItem.orderId);

        return newOrderItem;
    }

    async getCartItems(orderId: number) {
        // get all items in cart
        const cart = await this.OrderItemRepo.createQueryBuilder('order_items')
            .select('order_items.id, name, order_items.quantity, totalAmount, salePrice as price, order_items.itemId')
            .leftJoin("order_items.item", "item")
            .where('order_items.orderId = :orderId', { orderId })

            .getRawMany();

        // check if there is a flash sale for the item
        const newCartItems = cart.map(async (item) => {
            const flashSaleItem = await this.flashSaleItems.createQueryBuilder('flash_sale_items')
                .select('*')
                .leftJoin("flash_sale_items.flashSale", "flash_sale")
                .where(
                    'flash_sale_items.itemId = :itemId AND flash_sale.startTime < NOW() AND flash_sale.endTime > NOW() AND ' +
                    'flash_sale_items.quantity > 0 AND flash_sale_items.quantity >= :quantity',
                    { itemId: item.itemId, quantity: item.quantity }
                )
                .getRawOne();


            if (flashSaleItem && item.totalAmount != flashSaleItem.price * item.quantity) {
                console.log(item.totalAmount, flashSaleItem.price * item.quantity);

                this.OrderItemRepo.createQueryBuilder('order_items')
                    .update(OrderItem)
                    .set({ totalAmount: flashSaleItem.price * item.quantity })
                    .where('id = :id', { id: item.id })
                    .execute();

                return { ...item, price: flashSaleItem.price };
            }

            return item
        });

        return Promise.all(newCartItems);
    }

    async sumCart(orderId: number) {
        const total = await this.OrderItemRepo.createQueryBuilder('order_items')
            .select('SUM(totalAmount) as total')
            .where('order_items.orderId = :orderId', { orderId })
            .getRawOne();

        return this.orderRepo.save({ id: orderId, totalAmount: total.total });
    }

    async createCheckout(userId: number) {
        const order = await this.OrderItemRepo.createQueryBuilder('order_items')
            .select('items.id as itemId, order_items.quantity, items.quantity as stock, orders.voucherId, orders.status')
            .leftJoin("order_items.order", "orders")
            .leftJoin('orders.user', 'users')
            .leftJoin("order_items.item", "items")
            .where('users.id = :userId AND orders.createdAt IS NULL', { userId })
            .getRawMany();

        // check if cart is completed
        if (order[0]?.status !== 'completed') {
            throw new Error('Cart is not completed');
        }

        // check flash sale items time is still valid
        const flashSale = await this.flashSaleItems.createQueryBuilder('flash_sale_items')
            .select('*')
            .leftJoin("flash_sale_items.flashSale", "flash_sale")
            .getRawMany();

        console.log(flashSale);


        if (flashSale[0].endTime < new Date()) {
            throw new Error('Flash sale has ended');
        }

        // check if flash sale items quantity is still valid
        for (let i = 0; i < flashSale.length; i++) {
            if (flashSale[i].quantity - order[i].quantity < 0) {
                throw new Error('Flash sale item is out of stock');
            }
        }

        // check if voucher is valid
        await this.voucherService.validate({ id: order[0].voucherId });

        let restore: boolean = false;

        // decrease stock and check if there is enough stock
        const itemsUpdatePromises = order.map(async (item) => {
            const updatedStock = await this.itemRepo.createQueryBuilder('items')
                .update(Item)
                .set({ quantity: () => `quantity - ${item.quantity}` })
                .where(`id = :itemId AND (quantity - :buyQuantity) > 0`, { itemId: item.itemId, buyQuantity: item.quantity })
                .execute();

            if (updatedStock.affected === 0) {
                restore = true;
            }

            return updatedStock;
        });

        const itemsUpdate = await Promise.all(itemsUpdatePromises);

        // if any of the stock update fails, restore the stock
        if (restore) {
            for (let i = 0; i < order.length; i++) {
                if (itemsUpdate[i].affected === 1) {
                    await this.itemRepo.createQueryBuilder('items')
                        .update(Item)
                        .set({ quantity: () => `quantity + ${order[i].quantity}` })
                        .where(`id = :itemId`, { itemId: order[i].itemId })
                        .execute();
                }
            }

            throw new Error('out of stock');
        }

        // if payment is successful, add date to order
        const updatedOrder = await this.orderRepo.createQueryBuilder('orders')
            .update(Order)
            .set({ createdAt: new Date() })
            .where('userId = :userId AND createdAt IS NULL', { userId })
            .execute();

        console.log(updatedOrder);

        return "Payment successful";
    }

    getAllCarts() {
        return this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('createdAt IS NULL')
            .getRawMany();
    }

    getOrderByOrderItem(cartItemId: number) {
        return this.OrderItemRepo.createQueryBuilder('order_items')
            .select('userId, orderId')
            .leftJoin("order_items.order", "orders")
            .where('order_items.id = :cartItemId', { cartItemId })
            .getRawOne();
    }

    async applyVoucher(cart, voucherId: number, discount: number) {
        // if cart already has a voucher, return the cart
        if (cart.voucherId) {
            return cart;
        }

        const totalAmount = cart.totalAmount * (1 - discount);

        Object.assign(cart, { voucherId, totalAmount });

        return this.orderRepo.save(cart);
    }

    async getReportByMonthAndYear(month: number, year: number) {
        const report = await this.orderRepo.createQueryBuilder('orders')
            // COALESCE help return 0 if there is no order instead of null
            .select('COALESCE(sum(totalAmount), 0) as totalAmount, count(id) as totalOrders')
            .where('MONTH(createdAt) = :month AND YEAR(createdAt) = :year', { month, year })
            .getRawMany();

        console.log(report);

        return report;
    }
}