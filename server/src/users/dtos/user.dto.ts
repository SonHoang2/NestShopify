import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    token: string;

    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;
}