import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Category } from "./category.entity";

@Unique(['position', 'category'])
@Entity({ name: 'category_images' })
export class CategoryImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    position: number;

    @ManyToOne(() => Category, category => category.id)
    category: Category;
}