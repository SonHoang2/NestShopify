import { IsString, IsNumber, IsEnum, IsOptional } from "class-validator";
import { Action, Subject } from "src/common/variable";


export class CreatePermissionDto {
    @IsEnum(Action)
    @IsString()
    action: Action;

    @IsEnum(Subject)
    @IsString()
    subject: Subject;

    @IsNumber()
    roleId: number;
    
    @IsOptional()
    @IsString()
    condition: string;
}