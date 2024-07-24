import { IsNumber, IsString } from "class-validator";

export class CreateFlashSaleItemDto {
    @IsNumber()
    itemId: number;

    @IsNumber()
    flashSaleId: number;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;
}