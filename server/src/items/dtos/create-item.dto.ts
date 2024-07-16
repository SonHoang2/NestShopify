import { IsNumber, IsString } from "class-validator";

export class CreateItemDto {
    @IsString()
    name: string;

    @IsString()
    barcode: string;

    @IsNumber()
    purchasePrice: number;
    
    @IsNumber()
    salePrice: number;

    @IsNumber()
    weight: number;

    @IsString()
    thumbnailImage: string;

    @IsString()
    description: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    categoryId: number;
}