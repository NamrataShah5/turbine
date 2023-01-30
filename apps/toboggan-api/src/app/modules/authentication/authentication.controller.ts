import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HTTPHeaderAuthGuard } from '../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../auth/token.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly usersService: UsersService,
    private httpService: HttpService
  ) {}

  @Post('/password-reset-email')
  @UseGuards(HTTPHeaderAuthGuard)
  @UseInterceptors(TokenInterceptor, ResponseInterceptor)
  sendPasswordResetEmail(@Body() body: { email: string }) {
    if (!body || !body?.email) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('/login-with-creds')
  async loginWithCredentials(
    @Body() body: { email: string; password: string }
  ) {
    if (!body || !body?.email || !body?.password) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
    const response = await this.authService.loginWithCredentials(body);

    const token = response.idToken;

    if (!token) {
      throw new BadRequestException('Sorry, something went wrong.');
    }

    //! TODO: Refactor to something cleaner? I tried using different modules, but usersService does a request with wrong baseUrl!

    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`;

    this.httpService.axiosRef.defaults.baseURL =
      environment.GPCoreBaseUrl + '/user-management/api/v1';

    const isUserActive = await lastValueFrom(
      this.usersService.isUserActive(body.email)
    );

    if (!isUserActive) {
      throw new BadRequestException('Sorry, invalid credentials.');
    }

    return response;
  }
}
