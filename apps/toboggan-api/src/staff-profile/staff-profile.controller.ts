import { Body, Controller, Get, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { HTTPHeaderAuthGuard } from '../app/modules/auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../app/modules/auth/token.interceptor';
import { RequestInterceptor } from '../app/modules/common/request.interceptor';
import { ResponseInterceptor } from '../app/modules/common/response.interceptor';
import { StaffProfileService } from './staff-profile.service';

@UseGuards(HTTPHeaderAuthGuard)
@UseInterceptors(TokenInterceptor, ResponseInterceptor, RequestInterceptor)
@Controller('staff-profile')
export class StaffProfileController {
    constructor(private readonly staffProfileService: StaffProfileService) { }

    @Get('/:uuid')
    getStaffProfile(@Param('uuid') uuid) {
        return this.staffProfileService.getProfile(uuid);
    }


    @Put('/:uuid')
    updateStaffProfile(
        @Param('uuid') uuid,
        @Body() updatedProfile: IStaffProfile
    ) {
        return this.staffProfileService.updateProfile(uuid, updatedProfile);
    }
}
