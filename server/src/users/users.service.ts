import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    sanitizeUser(user: User) {
        delete user.password;
        return user;
    }

    create(info: CreateUserDto) {
        const user = this.userRepo.create(info);

        return this.userRepo.save(user);
    }

    async findAll({ fields, offset, limit, sort }: { fields: [], offset: number, limit: number, sort: {} }) {
        const users = await this.userRepo.find({
            select: fields,
            skip: offset,
            take: limit,
            order: sort,
        });

        users.forEach(user => {
            this.sanitizeUser(user);
        });

        return users;
    }

    // allow pass parameter or not
    async findAllActiveUser({
        fields = [],
        offset = 0,
        limit = 10,
        sort = {}
    }) {
        const users = await this.userRepo.find({
            select: fields,
            skip: offset,
            take: limit,
            order: sort,
            where: { active: true }
        });

        users.forEach(user => {
            this.sanitizeUser(user);
        });

        return users;
    }


    async findId(id: number) {
        const user = await this.userRepo.findOneBy({ id })

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.sanitizeUser(user);
    }

    async findEmail(email: string) {
        const user = await this.userRepo.findOneBy({ email })

        return user;
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);

        const newUser = await this.userRepo.save(user);

        return this.sanitizeUser(newUser);
    }

    async remove(id: number) {
        const user = await this.userRepo.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, { active: false });
        const UpdateUser = await this.userRepo.save(user);

        return this.sanitizeUser(UpdateUser);
    }

    async saveToken(email: string, token: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            throw new NotFoundException('user not found');
        }

        // token expires in 10 minutes
        await this.cacheManager.set(token, email, { ttl: 10 * 60 } as any);

        return user;
    }

    
    findToken(token: string) : Promise<string> {
        return this.cacheManager.get(token);
    }

    deleteToken(token: string) {
        return this.cacheManager.del(token);
    }
}
