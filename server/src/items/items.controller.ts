import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemsService } from './items.service';
import { updateItemDto } from './dtos/update-item.dto';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Action, Subject } from 'src/common/variable';


@Controller('/api/v1/items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService,
        private shareService: ShareService,
        private permissionsService: PermissionsService,
        private rolesService: RolesService
    ) { }

    @Get("/:itemId/images")
    async getImagesByItem(
        @Req() req,
        @Res() res,
        @Param('itemId') itemId: number
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Items);

            const images = await this.itemsService.getImagesByItem(itemId);

            return res.json({
                status: 'success',
                data: {
                    images
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get()
    async getAll(
        @Req() req,
        @Res() res,
        @Query() query: QueryDto
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Items);

            const newQuery = this.shareService.APIFeatures(query);
            
            const items = await this.itemsService.getAll(newQuery);

            return res.json({
                status: 'success',
                data: {
                    items
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get(':id')
    async getOne(
        @Req() req,
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Items);

            const item = await this.itemsService.getOne(id);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post()
    async create(
        @Req() req,
        @Res() res,
        @Body() body: CreateItemDto
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Create, Subject.Items);

            const item = await this.itemsService.create(body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch(':id')
    async update(
        @Req() req,
        @Res() res,
        @Param('id') id: number,
        @Body() body: updateItemDto
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Items);


            const item = await this.itemsService.update(id, body);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/category/:id')
    async getItemsByCategory(
        @Req() req,
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Items);

            const items = await this.itemsService.getItemsByCategory(id);

            return res.json({
                status: 'success',
                data: {
                    items
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async delete(
        @Req() req,
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.Items);

            const item = await this.itemsService.delete(id);

            return res.json({
                status: 'success',
                data: {
                    item
                },
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
