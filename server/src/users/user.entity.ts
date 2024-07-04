import { Role } from "src/users/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
    
    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({default: false})
    googleAccount: boolean;

    // add clerk role by default
    @Column({default: 4})
    roleId: number;

    @ManyToOne(() => Role, (role) => role.id)
    role: number;
}