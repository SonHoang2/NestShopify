import { IsNumber, IsOptional, IsString } from "class-validator";

export class updateItemDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    barcode: string;

    @IsOptional()
    @IsNumber()
    purchasePrice: number;
    
    @IsOptional()
    @IsNumber()
    salePrice: number;

    @IsOptional()
    @IsNumber()
    weight: number;

    @IsOptional()
    @IsString()
    thumbnailImage: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    categoryId: number;
}