import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItems } from './order-item.entity';
import { Item } from 'src/items/item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(OrderItems) private OrderItemsRepo: Repository<OrderItems>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
    ) { }


    async getAllOrdersByUser(userId: number) {
        return await this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('orders.userId = :userId AND createdAt IS NOT NULL', { userId })
            .getRawMany();
    }

    findCartByUser(userId: number) {
        const order = this.orderRepo.createQueryBuilder('orders')
            .select('*')
            .where('orders.userId = :userId AND createdAt IS NULL', { userId })
            .getRawOne();

        return order;
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
            throw new Error('Order already exist');
        }

        const newOrder = this.orderRepo.create({ userId });

        return await this.orderRepo.save(newOrder);
    }

    async createCartItem({ orderId, itemId, quantity }: { orderId: number; itemId: number; quantity: number }) {
        const CartItem = this.OrderItemsRepo.create({ orderId, itemId, quantity });

        const item = await this.itemRepo.createQueryBuilder('items')
            .select('salePrice as price, quantity')
            .where('items.id = :itemId', { itemId })
            .getRawOne();

        if (quantity <= 0 || quantity > item.quantity) {
            throw new Error('Invalid quantity');
        }

        const totalAmount = item.price * quantity;
        Object.assign(CartItem, { totalAmount });

        const orderItem = await this.OrderItemsRepo.save(CartItem);

        // Update total amount in order
        this.sumCart(orderId)

        return orderItem;
    }

    async updateCartItem(id: number, quantity: number) {
        const orderItem = await this.OrderItemsRepo.findOneBy({ id });

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

        const newOrderItem = await this.OrderItemsRepo.save(orderItem)

        // Update total amount in order
        this.sumCart(orderItem.orderId);

        return newOrderItem;
    }

    async deleteCartItem(id: number) {
        const orderItem = await this.OrderItemsRepo.findOneBy({ id });

        if (!orderItem) {
            throw new Error('Order item not found');
        }

        const newOrderItem = await this.OrderItemsRepo.remove(orderItem);

        // Update total amount in order
        this.sumCart(orderItem.orderId);

        return newOrderItem;
    }

    async getCartItems(orderId: number) {
        return await this.OrderItemsRepo.createQueryBuilder('order_items')
            .select(' order_items.id, name, order_items.quantity, totalAmount, salePrice as price, order_items.itemId')
            .leftJoin("order_items.item", "item")
            .where('order_items.orderId = :orderId', { orderId })
            .getRawMany();
    }

    async sumCart(orderId: number) {
        const total = await this.OrderItemsRepo.createQueryBuilder('order_items')
            .select('SUM(totalAmount) as total')
            .where('order_items.orderId = :orderId', { orderId })
            .getRawOne();

        return this.orderRepo.save({ id: orderId, totalAmount: total.total });
    }

    async createCheckout(userId: number) {
        const order = await this.OrderItemsRepo.createQueryBuilder('order_items')
            .select('items.id as itemId, order_items.quantity, items.quantity as stock')
            .leftJoin("order_items.order", "orders")
            .leftJoin('orders.user', 'users')
            .leftJoin("order_items.item", "items")
            .where('users.id = :userId AND orders.createdAt IS NULL', { userId })
            .getRawMany();

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
}