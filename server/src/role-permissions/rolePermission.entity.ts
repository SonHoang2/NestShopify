import { Permission } from "src/permissions/permission.entity";
import { Role } from "src/roles/role.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'RolePermissions' })
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, (role) => role.id)
    role: number;

    @ManyToOne(() => Permission, (permission) => permission.id)
    permission: number;
}