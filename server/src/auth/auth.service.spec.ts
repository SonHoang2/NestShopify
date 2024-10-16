import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../users/user.entity";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>
    let fakeMailerService: MailerService
    let fakeJwtService: JwtService
    let user: User;


    beforeEach(async () => {
        user = {
            id: 1, // Assign a unique ID or use a mock ID
            firstName: 'Test',
            lastName: 'User',
            email: 'test@gmail.com',
            password: 'password',
            googleAccount: false,
            avatar: 'avatar_default.png',
            passwordChangedAt: new Date(),
            emailVerified: false,
            active: true,
            roleId: 4,
            role: 4,
            orders: []
        }

        fakeUsersService = {
            // findEmail: () => Promise.resolve([]),
            create: () => Promise.resolve(user),
            saveToken: jest.fn(),
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
                        sendMail: () => Promise.resolve(),
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

});
