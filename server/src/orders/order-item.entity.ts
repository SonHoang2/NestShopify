import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Order } from "./order.entity";
import { Item } from "src/items/item.entity";

@Unique(['orderId', 'itemId'])
@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: string;

    @Column()
    orderId: number;

    @Column()
    itemId: number;

    @ManyToOne(() => Order, order => order.id)
    order: Order;

    @ManyToOne(() => Item, item => item.id)
    item: Item;

}