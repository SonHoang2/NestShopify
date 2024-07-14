import { Role } from "src/roles/role.entity";
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

    @Column({ default: false })
    googleAccount: boolean;

    @Column({ default: "avatar_default.png" })
    avatar: string;

    @Column({ default: null })
    passwordChangedAt: Date;

    @Column({ nullable: true })
    token: string;

    @Column({ default: null, nullable: true })
    tokenExpires: Date;

    @Column({ default: false })
    active: boolean;

    // add clerk role by default
    @Column({ default: 4 })
    roleId: number;

    @ManyToOne(() => Role, (role) => role.id)
    role: number;
}