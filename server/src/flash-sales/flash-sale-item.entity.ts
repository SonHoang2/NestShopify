import { Item } from "src/items/item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { FlashSale } from "./flash-sale.entity";

@Unique(['itemId', 'flashSaleId'])
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

    @ManyToOne(() => Item, item => item.id)
    item: Item;

    @ManyToOne(() => FlashSale, flashSale => flashSale.id)
    flashSale: FlashSale;
}