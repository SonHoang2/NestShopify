import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Controller('/api/v1/vouchers')
export class VouchersController {
    constructor(
        private vouchersService: VouchersService,
    ) { }

    @Get('/')
    async getAll(
        @Res() res,
    ) {
        try {
            const vouchers = await this.vouchersService.getAll();

            res.json({
                status: 'success',
                data: {
                    vouchers
                },
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/:id')
    async getOne(
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            const voucher = await this.vouchersService.getOne(id);

            res.json({
                status: 'success',
                data: {
                    voucher
                },
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/')
    async create(
        @Res() res,
        @Body() body: CreateVoucherDto,
    ) {
        try {
            const voucher = await this.vouchersService.create(body);

            res.json({
                status: 'success',
                data: {
                    voucher
                },
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:id')
    async update(
        @Res() res,
        @Param('id') id: number,
        @Body() body: UpdateVoucherDto,
    ) {
        try {
            const voucher = await this.vouchersService.update(id, body);

            res.json({
                status: 'success',
                data: {
                    voucher
                },
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async delete(
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            const voucher = await this.vouchersService.delete(id);

            res.json({
                status: 'success',
                data: {
                    voucher
                },
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
