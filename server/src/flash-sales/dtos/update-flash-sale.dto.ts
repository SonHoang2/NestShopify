import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateFlashSaleDto {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    startTime: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    endTime: Date;
    
    @IsOptional()
    @IsString()
    description: string;
}