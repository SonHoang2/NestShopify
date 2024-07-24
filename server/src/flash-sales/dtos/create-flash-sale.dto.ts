import { Transform } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateFlashSaleDto {
    @Transform(({ value }) => new Date(value))
    @IsDate()
    startTime: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    endTime: Date;

    @IsString()
    description: string;
}