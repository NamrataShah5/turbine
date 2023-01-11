import { JWTToken } from '@jwttoken';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom } from 'rxjs';

export type AuthType = 'FIREBASE_AUTH' | 'EMAIL_PW_AUTH';

@Injectable()
export class AuthenticationService {
  constructor(private readonly httpService: HttpService) {}

  getAuthType(jwtToken: JWTToken): AuthType {
    const decodedToken = jwtToken.decodeToken();

    if (decodedToken?.firebase?.sign_in_provider === 'password') {
      return 'EMAIL_PW_AUTH';
    }

    return 'FIREBASE_AUTH';
  }

  sendPasswordResetEmail(email: string) {
    return this.httpService.post(`/send-password-reset-email`, {
      email: email,
    });
  }

  async loginWithCredentials(body: { email: string; password: string }) {
    if (body.email == '' || body.password == '') {
      throw new HttpException('Bad request.', 400);
    }

    const res = await lastValueFrom(
      this.httpService.post(`/sign-in/credentials`, body).pipe(
        catchError((err) => {
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.error
          ) {
            const { error } = err.response.data;

            if (
              error.message &&
              error.message.includes('INVALID_IDP_RESPONSE')
            ) {
              throw new HttpException('Expired or invalid token.', 401);
            }
          }

          throw new HttpException(
            err?.response?.data?.error?.message,
            err?.response?.data?.error?.code
          );
        })
      )
    );
    let data = null;

    try {
      data = res.data.data;
    } catch (e) {
      throw new HttpException('Server error', 500);
    }

    return data;
  }
}
