import { IsNumber, IsOptional } from "class-validator";

export class UpdateFlashSaleItemDto {
    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    quantity: number;
}