import { Category } from "src/categories/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Category, category => category.id)
    category: Category;
}