import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Action, Subject } from 'src/common/variable';
import { PermissionsService } from 'src/permissions/permissions.service';

@Controller('/api/v1/roles')
export class RolesController {
    constructor(
        private rolesService: RolesService,
        private jwtService: JwtService,
        private permissionsService: PermissionsService
    ) { }


    @Get()
    async getAll(
        @Res() res,
        @Req() req: Request
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Roles);

            const roles = await this.rolesService.getAll();
            return res.status(HttpStatus.OK).json({
                status: 'success',
                data: {
                    roles
                },
            });
        } catch (error) {
            console.log({ error });
            return res.status(HttpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post()
    async create(
        @Req() req,
        @Res() res,
        @Body('roleName') roleName: string
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Create, Subject.Roles);

            // if allowed create role
            const role = await this.rolesService.create(roleName);

            return res.json({
                status: 'success',
                data: {
                    role
                },
            });
        } catch (error) {
            console.log({ error });
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/users/')
    async changeUserRole(
        @Res() res,
        @Req() req: Request,
        @Body() body: UpdateRoleDto,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Roles);

            const user = await this.rolesService.changeRole(body);

            return res.json({
                status: 'success',
                data: {
                    userId: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roleId: user.roleId,
                },
            });
        } catch (error) {
            console.log({ error });
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }


    @Delete('/:roleName')
    async delete(
        @Param('roleName') roleName: string,
        @Res() res,
        @Req() req: Request
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.Roles);

            const role = await this.rolesService.delete(roleName);

            return res.json({
                status: 'success',
                data: {
                    role
                },
            });
        } catch (error) {
            console.log({ error });
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
