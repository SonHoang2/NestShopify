import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { QueryDto } from 'src/common/dtos/query.dto';
import { ShareService } from 'src/common/share/share.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private shareService: ShareService,
        private permissionsService: PermissionsService,
        private roleService: RolesService
    ) { }

    @Get('/:id')
    async getUser(
        @Res() res,
        @Req() req,
        @Param('id') id: number
    ) {
        try {
            const { role: userRole, userId } = await this.roleService.getRoleAndUserId(req);

            // check permission for role
            const permission = await this.permissionsService.checkPermission(userRole.name, "read", "users");

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
                status: "error",
                message: error.message
            });
        }
    }

    @Get()
    async getUsers(
        @Res() res,
        @Query() query: QueryDto
    ) {
        const newQuery = this.shareService.APIFeatures(query);

        const users = await this.usersService.findAll(newQuery);
        return res.json({
            status: "success",
            data: {
                users
            }
        });
    }

    @Get('/email/:email')
    async getUserByEmail(
        @Res() res,
        @Param('email') email: string
    ) {
        try {
            let user = await this.usersService.findEmail(email);

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
                status: "error",
                message: error.message
            });
        }
    }

    @Patch('/:id')
    async updateUser(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
        @Res() res
    ) {
        try {
            const user = await this.usersService.update(id, body);
            return res.json({
                status: "success",
                data: {
                    user
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }

    @Delete('/:id')
    async deleteUser(
        @Param('id') id: number,
        @Res() res
    ) {
        try {
            const user = await this.usersService.remove(id);
            return res.json({
                status: "success",
                data: {
                    user
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }

    // @Get('/articles/:id')
    // async getResource(
    //     @Param('id') id: string,
    //     @Res() res: Response,
    //     @Req() req: Request
    // ) {
    //     const role = RolesController.getRole(req);

    //     // action resource role
    //     const getPermission = await this.usersService.getPermission("read", "articles", role.name);
    //     console.log({ getPermission });

    //     if (!getPermission) {
    //         throw new ForbiddenException('Not allowed');
    //     }

    //     console.log(getPermission.condition);

    //     // check condition
    //     // if (getPermission["condition"] === "author") {

    //     // }

    //     return (res as any).json({
    //         status: "success",
    //         data: {
    //             resource: `you are allowed to read article 1 ${id}`
    //         }
    //     })
    // }
}

