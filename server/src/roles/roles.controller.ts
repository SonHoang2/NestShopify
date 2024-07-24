import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

@Controller('/api/v1/roles')
export class RolesController {
    constructor(
        private rolesService: RolesService,
        private jwtService: JwtService,
    ) { }


    @Get()
    async getRoles(
        @Res() res,
        @Req() req: Request
    ) {
        try {
            const { userId, role: userRole } = await this.rolesService.getRoleAndUserId(req);
            console.log({ userRole, userId });

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to read on role');
            }

            const roles = await this.rolesService.getRoles();
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
    async createRole(
        @Req() req,
        @Res() res,
        @Body('roleName') roleName: string
    ) {
        try {
            const { userId, role: userRole } = await this.rolesService.getRoleAndUserId(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to create on role');
            }

            // if allowed create role
            const role = await this.rolesService.createRole(roleName);
            console.log({ userRole }, { role });

            return res.json({
                status: 'success',
                data: {
                    role
                },
            });
        } catch (error) {
            console.log({ error });
            return res.json({
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
            const { userId, role: userRole } = await this.rolesService.getRoleAndUserId(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to change user role');
            }

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
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }


    @Delete('/:roleName')
    async deleteRole(
        @Param('roleName') roleName: string,
        @Res() res,
        @Req() req: Request
    ) {
        try {
            const { userId, role: userRole } = await this.rolesService.getRoleAndUserId(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to delete user role');
            }

            const role = await this.rolesService.deleteRole(roleName);

            return res.json({
                status: 'success',
                data: {
                    role
                },
            });
        } catch (error) {
            console.log({ error });
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // @Post('/roles/:roleName/permissions')
    // async createRolePermission(
    //     @Body() body: { userAction: string, subject: string, role: number, condition: string },
    //     @Res() res: Response,
    //     @Req() req: Request
    // ) {
    //     try {
    //         const { userId, role: userRole } = await this.rolesService.getRoleAndUserId(req););
    //         console.log(userRole);

    //         // check permission of user
    //         if (userRole.name !== "admin") {
    //             throw new ForbiddenException('The role does not have permission to create role permission');
    //         }

    //         // create role action
    //         const action = await this.rolesService.createAction(body.userAction, body.subject, body.condition);
    //         console.log({ action });


    //         // create permission
    //         const permission = await this.rolesService.createPermission(action.id, body.role);
    //         console.log(permission);

    //         return (res as any).json({
    //             status: 'success',
    //             data: {
    //                 // permission
    //             },
    //         });
    //     } catch (error) {
    //         console.log({ error });
    //         return (res as any).json({
    //             status: 'error',
    //             message: error.message,
    //         });
    //     }
    // }
}
