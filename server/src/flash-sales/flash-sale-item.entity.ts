import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("flash_sale_items")
export class FlashSaleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: number;

    @Column()
    flashSaleId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;
}