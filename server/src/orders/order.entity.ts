import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { OrderItems } from "./order-item.entity";

@Unique(['userId', 'createdAt'])
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ nullable: true })
    createdAt: Date;

    // @Column()
    // status: string;

    @Column()
    userId: number;

    @OneToMany(() => OrderItems, orderItems => orderItems.order)
    orderItems: OrderItems[];

    @ManyToOne(() => User, user => user.id)
    user: User;

}