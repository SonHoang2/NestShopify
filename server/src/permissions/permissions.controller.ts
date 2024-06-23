import { Controller, Get } from '@nestjs/common';

@Controller('permissions')
export class PermissionsController {
    @Get('/test')
    test() {

        
        return { message: 'permissions test' };
    }
}
