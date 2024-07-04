import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('v1')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private jwtService: JwtService,
    ) { }

    async getRole(@Req() req: Request) {
        // take token from header and decode it
        const Token = req.headers['authorization'].split(' ')[1];
        const userId = this.jwtService.decode(Token).id;

        // get roles of user    
        const role = await this.usersService.getRole(userId);
        console.log(role);
        return role;
    }

    @Post('/auth/login')
    async loginUser(@Body() body: LoginUserDto, @Res() res: Response) {
        return this.authService.login(body.email, body.password, res);
    }

    @Post('/auth/signup')
    createUser(@Body() body: CreateUserDto, @Res() res: Response) {
        return this.authService.signup(body, res);
    }

    @Post('/auth/google')
    async authGoogle(@Query() query: { code: string; redirect_uri: string }, @Res() res: Response) {
        return this.authService.googleLogin(query, res);
    }

    @Get('/articles/:id')
    async getResource(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        const role = await this.getRole(req);

        // action resource role
        const getPermission = await this.usersService.getPermission("read", "articles", role.name);
        console.log({ getPermission });

        if (!getPermission) {
            throw new ForbiddenException('Not allowed');
        }

        console.log(getPermission.condition);

        // check condition
        // if (getPermission["condition"] === "author") {

        // }

        return (res as any).json({
            status: "success",
            data: {
                resource: `you are allowed to read article 1 ${id}`
            }
        })
    }

    @Post('/roles/:roleName')
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
            const role = await this.usersService.createRole(roleName);
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

    @Patch('/roles/:roleName/users/:userId')
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

            const user = await this.usersService.changeRole(parseInt(userId), roleName);

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


    @Delete('/roles/:roleName')
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

            const role = await this.usersService.deleteRole(roleName);

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

    @Post('/roles/:roleName/permissions')
    async createRolePermission(
        @Body() body: { userAction: string, subject: string, role: number, condition: string },
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            const userRole = await this.getRole(req);
            console.log(userRole);

            // check permission of user
            if (userRole.name !== "admin") {
                throw new ForbiddenException('The role does not have permission to create role permission');
            }

            // create role action
            const action = await this.usersService.createAction(body.userAction, body.subject, body.condition);
            console.log({ action });


            // create permission
            const permission = await this.usersService.createPermission(action.id, body.role);
            console.log(permission);

            return (res as any).json({
                status: 'success',
                data: {
                    // permission
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
}
