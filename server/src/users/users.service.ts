import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Permission } from './permission.entity';
import { Action } from './action.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
        @InjectRepository(Action) private actionRepo: Repository<Action>,
    ) { }

    create(info: CreateUserDto) {
        const user = this.userRepo.create(info);

        return this.userRepo.save(user);
    }

    findId(id: number) {
        return this.userRepo.findOneBy({ id });
    }

    findEmail(email: string) {
        return this.userRepo.findOneBy({ email });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.userRepo.save(user);
    }

    async remove(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return this.userRepo.remove(user);
    }

    async saveToken(email: string, token: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            throw new NotFoundException('user not found');
        }

        // token expires in 10 minutes
        let tokenExpires = new Date(Date.now() + 10 * 60 * 1000);

        Object.assign(user, { token, tokenExpires });
        return this.userRepo.save(user);
    }

    async findToken(token: string) {
        return this.userRepo.createQueryBuilder('users')
            .select("*")
            .where('users.token = :token AND users.tokenExpires > :date', { token, date: new Date() })
            .getRawOne();

    }

    // async getPermission(actionName: string, resource: string, roleName: string) {
    //     const permission = await this.permissionRepo.createQueryBuilder('permissions')
    //         .select("permissions.id, roles.name as roleName, actions.name as actionName, actions.tableName as tableName, actions.condition")
    //         .leftJoin('permissions.action', 'actions')
    //         .leftJoin('permissions.role', 'roles')
    //         .where(
    //             'actions.name = :actionName AND roles.name = :roleName AND actions.tableName = :tableName',
    //             { actionName, roleName, tableName: resource }
    //         )
    //         .getRawOne();

    //     return permission;
    // }

    // async createAction(userAction: string, subject: string, condition: string) {
    //     // if action exist
    //     const existAction = await this.actionRepo.findOneBy({ name: userAction, tableName: subject, condition: condition });
    //     if (existAction) {
    //         return existAction;
    //     }

    //     // if action not exist then create new one
    //     const action = this.actionRepo.create({ name: userAction, tableName: subject, condition: condition });
    //     return this.actionRepo.save(action);
    // }

    // createPermission(actionId: number, roleId: number) {
    //     const permission = this.permissionRepo.create({ actionId: actionId, roleId: roleId });
    //     return this.permissionRepo.save(permission);
    // }
}
