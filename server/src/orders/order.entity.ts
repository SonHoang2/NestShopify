
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "src/users/user.entity";
import { Voucher } from "src/vouchers/voucher.entity";

@Unique(['userId', 'createdAt'])
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "pending"})
    status: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ nullable: true })
    createdAt: Date;

    @Column()
    userId: number;

    @Column({ nullable: true })
    voucherId: number;

    @ManyToOne(() => Voucher, voucher => voucher.id)
    voucher: Voucher;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];

    @ManyToOne(() => User, user => user.id)
    user: User;

}