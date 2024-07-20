import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateVoucherDto {
    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @IsNumber()
    discount: number;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    expirationDate: Date;

    @IsOptional()
    @IsNumber()
    maxUses: number;

    @IsOptional()
    currentUses: number;
}