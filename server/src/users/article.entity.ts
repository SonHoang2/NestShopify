import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    authorId: number;
}