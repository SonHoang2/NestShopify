import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';
import { JwtPayload, decode } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    signToken(id: number) {
        return this.jwtService.sign({ id });
    }

    generatePassword() {
        const length = 20;
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
        return Array.from(crypto.getRandomValues(new Uint32Array(length)))
            .map((x) => characters[x % characters.length])
            .join('');
    }

    async signup(userInfo: CreateUserDto, res: Response) {
        try {
            let { email, password } = userInfo;
            // see if email is in use
            const users = await this.usersService.findEmail(email);
            console.log(users);

            if (users) {
                throw new BadRequestException('email in use');
            }
            // hash the users password
            const saltOrRounds = 10;
            password = await bcrypt.hash(password, saltOrRounds);

            // create a new user and save it
            const newUser = await this.usersService.create({ ...userInfo, password });

            const token = this.signToken(newUser.id);

            return (res as any).json({
                status: 'success',
                token,
                data: {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                    }
                }
            })
        } catch (error) {
            console.log({ error });
            return (res as any).json({
                status: 'error',
                message: error.message,
            });
        }

    }

    async login(email: string, password: string, res: Response) {
        try {
            const user = await this.usersService.findEmail(email);

            if (!user) {
                throw new NotFoundException('email or password is invalid');
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new BadRequestException('email or password is invalid')
            }

            const token = this.signToken(user.id);

            return (res as any).json({
                status: 'success',
                token,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    }
                }
            })
        } catch (error) {
            console.log({ error });
            return (res as any).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async googleLogin(query, res) {
        let { code, redirectUri } = query; // code from service provider which is appended to the frontend's URL

        const clientId = process.env.GOOGLE_CLIENT_ID; // CLIENT_ID_FROM_APP_CREATED
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // CLIENT_SECRET_FROM_APP_CREATED
        const grantType = 'authorization_code'; // this tells the service provider to return a code which will be used to get a token for making requests to the service provider
        const url = 'https://oauth2.googleapis.com/token'; // link to api to exchange code for token.

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId,
                clientSecret,
                redirectUri,
                code,
                grantType,
            }),
        });
        const data = await response.json();

        console.log({ data });
        const { email, given_name, family_name } = decode(data.id_token) as JwtPayload;
        console.log(email, given_name, family_name);

        // use if i want to get more info about the user
        // const tokenFromGoogle = data.access_token;
        // const urlForGettingUserInfo = 'https://www.googleapis.com/oauth2/v2/userinfo';

        // const response1 = await fetch(urlForGettingUserInfo, {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${tokenFromGoogle}`,
        //     },
        // });

        // const userData = await response1.json();

        let user = await this.usersService.findEmail(email);
        if (!user) {
            let password = this.generatePassword();
            password = await bcrypt.hash(password, 10);
            user = await this.usersService.create({ email, firstName: given_name, lastName: family_name, password, googleAccount: true } as CreateUserDto);
        }
        console.log(user);
        const token = this.signToken(user.id);

        return res.json({
            status: 'success',
            token: token,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
}