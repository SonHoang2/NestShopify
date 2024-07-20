import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("flash_sales")
export class FlashSale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column()
    description: string;
}