import { Optional } from "@nestjs/common";
import { IsNumber, IsString } from "class-validator";

export class updateItemDto {
    @IsString()
    name: string;

    @Optional()
    @IsString()
    barcode: string;

    @Optional()
    @IsNumber()
    purchasePrice: number;
    
    @Optional()
    @IsNumber()
    salePrice: number;

    @Optional()
    @IsNumber()
    weight: number;

    @Optional()
    @IsString()
    thumbnailImage: string;

    @Optional()
    @IsString()
    description: string;

    @Optional()
    @IsNumber()
    quantity: number;

    @Optional()
    @IsNumber()
    categoryId: number;
}