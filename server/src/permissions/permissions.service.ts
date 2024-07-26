import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission) private permissionRepo: Repository<Permission>
    ) { }

    getAll({ limit, sort, offset }) {
        console.log(limit, sort, offset);

        const permission = this.permissionRepo.createQueryBuilder('permission')
            .select('permission.id, role.name as role, action.name as action, action.tableName, action.condition')
            .leftJoin('permission.role', 'role')
            .leftJoin('permission.action', 'action')
            .orderBy(sort)
            // .skip(offset)
            // .take(limit)
            .getRawMany();
        return permission;
    }

    getOneByRole(roleId: number) {
        return this.permissionRepo.findOneBy({ roleId });
    }

    create(actionId: number, roleId: number) {
        const permission = this.permissionRepo.create({ actionId, roleId });
        return this.permissionRepo.save(permission);
    }

    async delete(id: number) {
        const permission = await this.permissionRepo.findOneBy({ id });
        return this.permissionRepo.remove(permission);
    }

    async checkPermission(role: string, action: string, subject: string) {


        let permission = await this.permissionRepo.createQueryBuilder('permissions')
            .select("permissions.id, roles.name as roleName, actions.name as actionName, actions.tableName as tableName, actions.condition")
            .leftJoin('permissions.action', 'actions')
            .leftJoin('permissions.role', 'roles')
            .where(
                "roles.name = :role AND (actions.name = :action OR actions.name = 'manage') AND (actions.tableName = :subject OR actions.tableName = 'all')",
                { role, action, subject }
            )
            .getRawOne();
            
        // console.log({ permission });
         
        return permission;
    }

}
