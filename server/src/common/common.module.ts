import { Module } from '@nestjs/common';
import { ShareService } from './share/share.service';

@Module({
    providers: [ShareService],
    exports: [ShareService]
})
export class CommonModule { }
