import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../users/user.entity";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        fakeUsersService = {
            // findEmail: () => Promise.resolve([]),
            create: (info: CreateUserDto) => {
                const user = {
                    id: 1, // Assign a unique ID or use a mock ID
                    email: info.email,
                    password: info.password,
                    googleAccount: false, // or any default value
                    avatar: '',
                } as User;

                console.log("Promise.resolve(user)", Promise.resolve(user));

                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: () => 'signed-token'
                    }
                },
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: () => Promise.resolve([])
                    }
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('can create an instance of AuthService', async () => {
        expect(service).toBeDefined();
    });

    it('check generate random string return correct length', async () => {
        const randomString = service.generateRandowString(32);
        expect(randomString).toHaveLength(32);
    });

    it('check signToken return a string', async () => {
        const token = service.signToken(1);
        console.log("token", token);

        expect(typeof token).toEqual('string');
    });

    it('check emailRegister return a user', async () => {
        const user = await service.emailRegister(
            { email: "test@gmail.com" },
            { json: () => { } }
        );

        console.log("user", user);

    })
});
