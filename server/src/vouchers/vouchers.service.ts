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

    async update(id: number, attrs : UpdateVoucherDto) {
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
}
