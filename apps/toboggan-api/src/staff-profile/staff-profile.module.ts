import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { StaffProfileController } from './staff-profile.controller';
import { StaffProfileService } from './staff-profile.service';

@Module({
    imports: [
        HttpModule.register({
            baseURL: environment.GPCoreBaseUrl + '/user-management/api/v1',
            timeout: 8000,
            maxRedirects: 3,
        }),
    ],
    controllers: [StaffProfileController],
    providers: [StaffProfileService],
})
export class StaffProfileModule { }
