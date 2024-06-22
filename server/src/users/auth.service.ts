import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';
import { JwtPayload, decode } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // see if email is in use
        const users = await this.usersService.find(email);
        console.log(users);

        if (users.length) {
            throw new BadRequestException('email in use');
        }
        // hash the users password
        const saltOrRounds = 10;
        password = await bcrypt.hash(password, saltOrRounds);

        // create a new user and save it
        const user = await this.usersService.create(email, password);
        return user;
    }

    async login(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        console.log(user, typeof user);

        if (!user) {
            throw new NotFoundException('email or password is invalid');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new BadRequestException('email or password is invalid')
        }

        return user
    }

    async googleLogin(query, res) {        
        let { code, redirect_uri } = query; // code from service provider which is appended to the frontend's URL
        
        const client_id = process.env.GOOGLE_CLIENT_ID; // CLIENT_ID_FROM_APP_CREATED
        const client_secret = process.env.GOOGLE_CLIENT_SECRET; // CLIENT_SECRET_FROM_APP_CREATED
        // The client_id and client_secret should always be private, put them in the .env file
        const grant_type = 'authorization_code'; // this tells the service provider to return a code which will be used to get a token for making requests to the service provider
        const url = 'https://oauth2.googleapis.com/token'; // link to api to exchange code for token.

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id,
                client_secret,
                redirect_uri,
                code,
                grant_type,
            }),
        });
        const data = await response.json();

        console.log({data});
        const user = decode(data.id_token) as JwtPayload;
        console.log({user});
        
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

        

        return res.json({
            status: 'success',
            data: {
                user: {
                    email: user.email,
                },
            },
        });
    }
}