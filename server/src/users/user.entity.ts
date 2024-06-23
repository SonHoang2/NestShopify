import { Role } from "src/roles/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity({ name: 'Users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;
    
    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({default: false})
    google_account: boolean;

    @OneToMany(() => Role, (role) => role.user)
    roles: Role[];

}