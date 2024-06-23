
import { Action } from "src/actions/action.entity";
import { Resource } from "src/resources/resource.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: false})
    allow: boolean;

    @Column({default: false})
    deny: boolean; 

    @ManyToOne(() => Resource, (resource) => resource.id)
    resource: number;

    @ManyToOne(() => Action, (action) => action.id)
    action: number;
}