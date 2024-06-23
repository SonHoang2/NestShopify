import { Module } from '@nestjs/common';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Module({})
export class RolePermissionsModule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
