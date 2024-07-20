import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateVoucherDto {
    @IsString()
    code: string;

    @IsNumber()
    discount: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    expirationDate: Date;

    @IsNumber()
    maxUses: number;
}