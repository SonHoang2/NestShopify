import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class QueryDto {
    @Type(() => Number)
    @IsOptional()
    offset: number;

    @Type(() => Number)
    @IsOptional()
    limit: number;

    @IsString()
    @IsOptional()
    sort: string;

    @IsString()
    @IsOptional()
    fields: string;
}