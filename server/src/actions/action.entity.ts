import { Permission } from "src/permissions/permission.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Actions' })
export class Action {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    scope: string;

    @OneToMany(() => Permission, (permission) => permission.action) 
    permissions: Permission[]; 
    
}