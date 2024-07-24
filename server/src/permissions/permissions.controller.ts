import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Response } from 'express';
import { Request } from 'express';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { RolesService } from 'src/roles/roles.service';
import { ActionsService } from 'src/actions/actions.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';

@Controller('/api/v1/permissions')
export class PermissionsController {
    constructor(
        private permissionsService: PermissionsService,
        private roleService: RolesService,
        private actionsService: ActionsService,
        private shareService: ShareService
    ) { }


    // @Post('/roles/:roleName/permissions')
    // async createRolePermission(
    //     @Body() body: { userAction: string, subject: string, role: number, condition: string },
    //     @Res() res: Response,
    //     @Req() req: Request
    // ) {
    //     try {
    //         const { userId, role: userRole } = await this.getRoleAndUserId(req););
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

    @Get()
    async getAll(
        @Res() res: Response,
        @Req() req: Request,
        @Query() query: QueryDto
    ) {
        try {
            const { role: userRole } = await this.roleService.getRoleAndUserId(req);

            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to read role permission');
            }

            const newQuery = this.shareService.APIFeatures(query);

            const permissions = await this.permissionsService.getAll(newQuery);

            return res.status(200).json({
                status: 'success',
                data: {
                    permissions
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post()
    async create(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: CreatePermissionDto
    ) {
        try {
            const { role: userRole } = await this.roleService.getRoleAndUserId(req);

            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to create role permission');
            }

            const action = await this.actionsService.create(body);
            console.log({ action });

            const permission = await this.permissionsService.create(action.id, body.roleId);
            console.log({ permission });

            return res.status(201).json({
                status: 'success',
                data: {
                    permission
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async delete(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole } = await this.roleService.getRoleAndUserId(req);

            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to delete role permission');
            }

            const permission = await this.permissionsService.delete(id);

            return res.status(200).json({
                status: 'success',
                data: {
                    permission
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
