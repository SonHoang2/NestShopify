import { Category } from "src/categories/category.entity";
import { Column, Entity, ManyToOne, OneToMany, Or, PrimaryGeneratedColumn } from "typeorm";
import { ItemImage } from "./item-image.entity";
import { OrderItem } from "src/orders/order-item.entity";
import { FlashSaleItem } from "src/flash-sales/flash-sale-item.entity";

@Entity("items")
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    barcode: string;

    @Column('decimal', { precision: 10, scale: 2 })
    purchasePrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    salePrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    weight: number;

    @Column()
    thumbnailImage: string;

    @Column()
    description: string;

    @Column()
    quantity: number;

    @OneToMany(() => ItemImage, itemImage => itemImage.item)
    itemImages: ItemImage[];

    @OneToMany(() => OrderItem, orderItem => orderItem.item)
    orderItems: OrderItem[];

    @OneToMany(() => FlashSaleItem, flashSaleItem => flashSaleItem.item)
    flashSaleItems: FlashSaleItem[];

    @ManyToOne(() => Category, category => category.id)
    category: Category;

}