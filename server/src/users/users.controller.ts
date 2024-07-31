import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Action, Subject } from '../common/variable';

@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private shareService: ShareService,
        private permissionsService: PermissionsService,
        private rolesService: RolesService
    ) { }

    @Get('/active')
    async getAllActiveUser(
        @Req() req,
        @Res() res,
        @Query() query: QueryDto
    ) {
        try {
            const { role: userRole } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author

            if (permission.condition === "author") {
                throw new Error('Permission denied');
            }

            const newQuery = this.shareService.APIFeatures(query);

            const users = await this.usersService.findAllActiveUser(newQuery);
            return res.json({
                status: "success",
                data: {
                    users
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });

        }
    }

    @Get('/:id')
    async getOne(
        @Res() res,
        @Req() req,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author

            if (permission.condition === "author" && userId != id) {
                throw new Error('Permission denied');
            }

            const user = await this.usersService.findId(id);
            return res.json({
                status: "success",
                data: {
                    user
                }
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
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author
            console.log({ permission });

            if (permission.condition === "author") {
                throw new Error('Permission denied');
            }

            const newQuery = this.shareService.APIFeatures(query);
            const users = await this.usersService.findAll(newQuery);
            return res.json({
                status: "success",
                data: {
                    users
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });

        }

    }

    @Get('/email/:email')
    async getOneByEmail(
        @Req() req,
        @Res() res,
        @Param('email') email: string
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Read, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author

            let user = await this.usersService.findEmail(email);
                        
            // if permission condition is author, check if user is null
            // if user is not null, check if user id is not equal to userRole id
            if (permission.condition === "author") {
                if (!user) {
                    throw new Error('Permission denied');
                }
                if (user.id !== userId) {
                    throw new Error('Permission denied');
                }
            }

            if (!user) {
                throw new NotFoundException('user not found');
            }

            user = this.usersService.sanitizeUser(user);
            return res.json({
                status: "success",
                data: {
                    user
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:id')
    async update(
        @Req() req,
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
        @Res() res
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author

            if (permission.condition === "author" && userId != id) {
                throw new Error('Permission denied');
            }

            const user = await this.usersService.update(id, body);
            return res.json({
                status: "success",
                data: {
                    user
                }
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
        @Param('id') id: number,
        @Res() res,
        @Req() req
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.Users);

            // if permission passed, check condition
            // if condition is author, check if the user is the author

            if (permission.condition === "author" && userId != id) {
                throw new Error('Permission denied');
            }

            const user = await this.usersService.remove(id);

            return res.json({
                status: "success",
                data: {
                    user
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

