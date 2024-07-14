import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "../roles/role.entity";
import { Action } from "./action.entity";

@Unique(['roleId', 'actionId'])
@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleId: number;

    @Column()
    actionId: number;

    @ManyToOne(() => Action, action => action.id)
    action: Action;

    @ManyToOne(() => Role, (role) => role.id)
    role: number;
}