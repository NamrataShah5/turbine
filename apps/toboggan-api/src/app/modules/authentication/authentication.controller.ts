import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HTTPHeaderAuthGuard } from '../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../auth/token.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/passwordresetemail')
  @UseGuards(HTTPHeaderAuthGuard)
  @UseInterceptors(TokenInterceptor, ResponseInterceptor)
  sendPasswordResetEmail(@Body() body: { email: string }) {
    if (!body || !body?.email) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('/loginwithcreds')
  loginWithCredentials(@Body() body: { email: string; password: string }) {
    if (!body || !body?.email || !body?.password) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
    return this.authService.loginWithCredentials(body);
  }
}
