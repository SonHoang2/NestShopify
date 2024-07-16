import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}