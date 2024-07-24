import { IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

enum Subject {
    Users = "users",
    Orders = "orders",
    Items = "items",
    All = "all",
}

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