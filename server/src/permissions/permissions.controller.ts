import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Response } from 'express';
import { Request } from 'express';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { RolesService } from 'src/roles/roles.service';
import { ActionsService } from 'src/actions/actions.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';
import { Action, Subject } from 'src/common/variable';

@Controller('/api/v1/permissions')
export class PermissionsController {
    constructor(
        private permissionsService: PermissionsService,
        private rolesService: RolesService,
        private actionsService: ActionsService,
        private shareService: ShareService
    ) { }

    @Get()
    async getAll(
        @Res() res: Response,
        @Req() req: Request,
        @Query() query: QueryDto
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Permissions);

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
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Create, Subject.Permissions);


            const action = await this.actionsService.create(body);

            const permission = await this.permissionsService.create(action.id, body.roleId);

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
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.Permissions);

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
