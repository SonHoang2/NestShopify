import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Post('/login')
    async loginUser(@Body() body: LoginUserDto) {
        console.log(await this.authService.login(body.email, body.password));

        return this.authService.login(body.email, body.password);
    }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body);
    }

    @Post('/google')
    async authGoogle(@Query() query: { code: string; redirect_uri: string }, @Res() res) {
        return this.authService.googleLogin(query, res);
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const user = await this.usersService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
        return this.usersService.update(parseInt(id), body);

    }

}
