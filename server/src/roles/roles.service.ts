import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private roleRepo: Repository<Role>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async getRole(id: number): Promise<{ name: string; id: number }> {
        const roles = await this.userRepo.createQueryBuilder('users')
            .select('name, roles.id')
            .leftJoin('users.role', 'roles')
            .where('users.id = :id', { id })
            .getRawOne();

        return roles;
    }

    async createRole(role: string) {
        const existRole = await this.roleRepo.findOneBy({ name: role });

        if (existRole) {
            throw new ConflictException('role already exist');
        }

        const newRole = this.roleRepo.create({ name: role });

        return this.roleRepo.save(newRole);
    }

    async changeRole(userId: number, roleName: string) {
        console.log(userId, roleName);
        const user = await this.userRepo.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const role = await this.roleRepo.findOneBy({ name: roleName });

        if (!role) {
            throw new NotFoundException('role not found');
        }

        // change role of user
        Object.assign(user, { roleId: role.id });
        return this.userRepo.save(user);
    }

    async deleteRole(roleName: string) {
        const role = await this.roleRepo.findOneBy({ name: roleName });
        console.log(role);
        if (!role) {
            throw new NotFoundException('role not found');
        }

        return this.roleRepo.remove(role);
    }
}
