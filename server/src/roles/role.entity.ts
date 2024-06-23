import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @ManyToOne(() => User, (user) => user.id)
    user: User;
}