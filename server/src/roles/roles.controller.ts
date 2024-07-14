import { Controller, Delete, ForbiddenException, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtService } from '@nestjs/jwt';

@Controller('/api/v1/roles')
export class RolesController {
    constructor(
        private rolesService: RolesService,
        private jwtService: JwtService,
    ) { }

    async getRole(@Req() req: Request) {
        // take token from header and decode it
        const Token = req.headers['authorization'].split(' ')[1];
        const userId = this.jwtService.decode(Token).id;

        // get roles of user    
        const role = await this.rolesService.getRole(userId);
        console.log(role);
        return role;
    }

    @Post('/:roleName')
    async createRole(
        @Param('roleName') roleName: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const userRole = await this.getRole(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to create on role');
            }

            // if allowed create role
            const role = await this.rolesService.createRole(roleName);
            console.log({ userRole }, { role });

            return (res as any).json({
                status: 'success',
                data: {
                    role
                },

            });
        } catch (error) {
            console.log({ error });
            return (res as any).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:roleName/users/:userId')
    async changeUserRole(
        @Param() { userId, roleName }: { userId: string; roleName: string },
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            const userRole = await this.getRole(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to change user role');
            }

            const user = await this.rolesService.changeRole(parseInt(userId), roleName);

            return (res as any).json({
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
            return (res as any).json({
                status: 'error',
                message: error.message,
            });
        }
    }


    @Delete('/:roleName')
    async deleteRole(
        @Param('roleName') roleName: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            const userRole = await this.getRole(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to delete user role');
            }

            const role = await this.rolesService.deleteRole(roleName);

            return (res as any).json({
                status: 'success',
                data: {
                    role
                },
            });
        } catch (error) {
            console.log({ error });
            return (res as any).json({
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
    //         const userRole = await this.getRole(req);
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
