import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { AuthService } from './auth.service';

@Controller('/api/v1/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/login')
    async loginUser(
        @Body() body: LoginUserDto,
        @Res() res: Response
    ) {
        return this.authService.login(body.email, body.password, res);
    }

    @Post('/signup')
    createUser(
        @Body() body: CreateUserDto,
        @Res() res: Response
    ) {
        return this.authService.signup(body, res);
    }

    @Post('/google')
    async authGoogle(
        @Query() query: { code: string; redirect_uri: string },
        @Res() res: Response
    ) {
        return this.authService.googleLogin(query, res);
    }

    @Post('/verify/email')
    async sendCodeToEmail(
        @Body() Body: { email: string },
        @Res() res: Response
    ) {
        return this.authService.sendCodeToEmail(Body, res);
    }

    @Get('/verify/email/:token')
    async verifyEmailCode(
        @Param('token') token: string,
        @Res() res: Response
    ) {
        console.log(token);
        
        return this.authService.verifyEmailCode(token, res);
    }
}
