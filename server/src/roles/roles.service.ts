import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private roleRepo: Repository<Role>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) {}

    extractTokenFromHeader(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async getRoleAndUserId(req: Request): Promise<{ role: { name: string; id: number }; userId: number }> {
        // take token from header
        const token = this.extractTokenFromHeader(req);
        
        if (!token) {
            throw new UnauthorizedException("you need to login");
        }
        try {

            await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });

            // get user id from token
            const userId: number = this.jwtService.decode(token).id;

            // get roles of user    
            const role = await this.getRole(userId);

            return {role, userId};
        } catch (error) {
            console.log({error});
            
            throw new UnauthorizedException("token is invalid or expired");
        }
    }

    async getRole(id: number): Promise<{ name: string; id: number }> {
        const roles = await this.userRepo.createQueryBuilder('users')
            .select('name, roles.id')
            .leftJoin('users.role', 'roles')
            .where('users.id = :id', { id })
            .getRawOne();

        return roles;
    }

    getRoles() {
        return this.roleRepo.find();
    }

    async createRole(role: string) {
        const existRole = await this.roleRepo.findOneBy({ name: role });

        if (existRole) {
            throw new ConflictException('role already exist');
        }

        const newRole = this.roleRepo.create({ name: role });

        return this.roleRepo.save(newRole);
    }

    async changeRole({userId , roleName} : {userId: number, roleName: string}) {
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
