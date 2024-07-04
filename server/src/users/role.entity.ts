import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permission.entity";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({default: "clerk", unique: true})
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @OneToMany(() => Permission, (permission) => permission.role)
    role: Permission[];
}