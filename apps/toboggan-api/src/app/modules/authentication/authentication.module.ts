import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { GroupsService } from '../groups/groups.service';
import { UsersService } from '../users/users.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: environment.GPCoreBaseUrl + '/authentication/api/v1',
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UsersService, GroupsService],
})
export class AuthenticationModule {}
