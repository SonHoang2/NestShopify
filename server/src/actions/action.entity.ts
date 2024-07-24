import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Permission } from "../permissions/permission.entity";

@Unique(['name', 'tableName', 'condition'])
@Entity({ name: 'actions' })
export class Action {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // @Column()
    // field: Array;
    
    @Column({default: ""})
    condition: string;

    @Column()
    tableName: string;

    @OneToMany(() => Permission, (permission) => permission.action)
    permissions: Permission[];
}      
