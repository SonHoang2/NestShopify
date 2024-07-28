import { Order } from "src/orders/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("vouchers")
export class Voucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column('decimal', { precision: 10, scale: 2 })
    discount: number;

    @Column()
    expirationDate: Date;

    @Column()
    maxUses: number;

    @Column({ default: 0 })
    currentUses: number;

    @OneToMany(() => Order, order => order.voucher)
    orders: Order[];
}