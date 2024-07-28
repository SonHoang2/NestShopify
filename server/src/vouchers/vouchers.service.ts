import { Injectable } from '@nestjs/common';
import { Voucher } from './voucher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Injectable()
export class VouchersService {
    constructor(
        @InjectRepository(Voucher) private voucherRepository: Repository<Voucher>,
    ) { }

    async getAll() {
        return this.voucherRepository.find();
    }

    async getOne(id: number) {
        const voucher = await this.voucherRepository.findOneBy({ id });

        if (!voucher) {
            throw new Error('Voucher not found');
        }

        return voucher;
    }

    async create({ code, discount, expirationDate, maxUses }: CreateVoucherDto) {
        const voucher = await this.voucherRepository.create({ code, discount, expirationDate, maxUses });
        return this.voucherRepository.save(voucher);
    }

    async update(id: number, attrs: UpdateVoucherDto) {
        const voucher = await this.voucherRepository.findOneBy({ id });

        if (!voucher) {
            throw new Error('Voucher not found');
        }

        Object.assign(voucher, attrs);

        return this.voucherRepository.save(voucher);

    }

    async delete(id: number) {
        const voucher = await this.voucherRepository.findOneBy({ id });

        if (!voucher) {
            throw new Error('Voucher not found');
        }

        return this.voucherRepository.remove(voucher);
    }

    async validate({ id, code }: { id?: number, code?: string }) {
        const voucher = await this.voucherRepository.createQueryBuilder('voucher')
            .select('*')
            .where('voucher.code = :code OR voucher.id = :id', { code, id })
            .getRawOne();

        if (!voucher) {
            throw new Error('Voucher not found');
        }

        if (voucher.currentUses > voucher.maxUses) {
            throw new Error('Voucher has reached its limit of uses');
        }

        if (voucher.expirationDate < new Date()) {
            throw new Error('Voucher has expired');
        }

        return voucher;
    }
}
