import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FlashSaleItem } from "./flash-sale-item.entity";

@Entity("flash_sales")
export class FlashSale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column({ unique: true })
    description: string;

    @OneToMany(() => FlashSaleItem, flashSaleItem => flashSaleItem.flashSale)
    flashSaleItems: FlashSaleItem[];
}