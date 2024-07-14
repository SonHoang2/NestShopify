import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('/api/v1')
export class UsersController {
    constructor(
        private authService: AuthService,
    ) { }


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

    @Post('/auth/verify/email')
    async verifyEmail(@Body() Body: { email: string, firstName: string, lastName: string }, @Res() res: Response) {
        return this.authService.verifyEmail(Body, res);
    }

    @Post('/auth/verify/email/:token')
    async verifyToken(@Param('token') token : string, @Res() res: Response) {
        return this.authService.verifyToken(token, res);
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

