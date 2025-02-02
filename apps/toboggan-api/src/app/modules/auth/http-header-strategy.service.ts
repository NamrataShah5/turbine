/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { JWTToken } from 'libs/jwttoken/jwttoken';
import { Strategy } from 'passport-http-header-strategy';
import { catchError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class HTTPHeaderStrategy extends PassportStrategy(
  Strategy,
  'httpheader'
) {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private authenticationService: AuthenticationService
  ) {
    super({
      header: 'Authorization',
      param: 'app_token',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, token: string): Promise<unknown> {
    const jwtToken = new JWTToken(token);
    const authType = this.authenticationService.getAuthType(jwtToken);

    if (
      authType === 'EMAIL_PW_AUTH' ||
      request.headers['idp-override'] == 'true'
    ) {
      return {
        data: {
          idToken: request.headers['authorization'].replace('Bearer ', ''),
        },
      };
    }
    if (!token) {
      throw new UnauthorizedException();
    }

    // decode token supplied by user
    jwtToken.decodeToken();

    // use cache if enabled
    if (environment.enableCache) {
      // return token from cache if email key exists in cache
      const cachedToken: string = await this.cacheManager.get(
        jwtToken.getEmailId()
      );
      if (cachedToken) {
        return cachedToken;
      }
    } else {
      console.log('cache disabled');
    }

    // continue to acquire token if no token found in cache associated with user email
    console.log('acquiring fresh token ...');

    const headers = {
      Authorization: `Bearer ${jwtToken.jwtToken}`,
    };

    const newToken = await lastValueFrom(
      this.httpService
        .post(
          `${environment.GPCoreBaseUrl}/authentication/api/v1/sign-in/token`,
          {},
          { headers }
        )
        .pipe(
          catchError((err) => {
            console.log(err.response.data.error);
            throw new HttpException(
              err.response.data.error.message,
              err.response.data.error.code
            );
          })
        )
    );

    if (environment.enableCache) {
      // cache token acquire for this user
      await this.cacheManager.set(jwtToken.getEmailId(), newToken.data, {
        ttl: 600,
      });
    }

    return newToken.data;
  }
}
