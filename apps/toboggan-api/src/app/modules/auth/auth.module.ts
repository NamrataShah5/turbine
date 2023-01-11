import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { HTTPHeaderStrategy } from './http-header-strategy.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [HttpModule, PassportModule, CacheModule.register()],
  providers: [HTTPHeaderStrategy, AuthenticationService],
})
export class AuthModule {}
