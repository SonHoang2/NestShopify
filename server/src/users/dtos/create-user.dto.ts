import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;
}