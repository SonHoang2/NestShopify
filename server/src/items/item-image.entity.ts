import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity('item_images')
export class ItemImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: number;

    @Column()
    image: string;

    @ManyToOne(() => Item, item => item.id)
    item: Item;
}