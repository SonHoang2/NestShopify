import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryImage } from "./category-image.entity";
import { Item } from "src/items/item.entity";

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => CategoryImage, categoryImage => categoryImage.category)
    images: CategoryImage[];

    @OneToMany(() => Item, item => item.category)
    items: Item[];
}