import { IsNumber, IsString } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    roleName: string;

    @IsNumber()
    userId: number;
}