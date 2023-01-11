import jwt_decode from 'jwt-decode';

export interface IDecodedToken {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp?: number;
  email?: string;
  email_verified: boolean;
  firebase: {
    identities: {
      email: string[];
    };
    sign_in_provider?: string;
  };
  displayname?: string;
  given_name?: string;
  family_name?: string;
}

export class JWTToken {
  jwtToken = '';
  private decodedToken: Partial<IDecodedToken> = {};

  constructor(token: string) {
    this.jwtToken = token;
  }

  setToken(token: string): string {
    if (token) {
      this.jwtToken = token;
    }
    return this.jwtToken;
  }

  decodeToken(): Partial<IDecodedToken> {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
    return this.decodedToken;
  }

  getDecodeToken() {
    return this.decodeToken;
  }

  getUser() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['displayname'] : null;
  }

  getEmailId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['email'] : null;
  }

  getExpiryTime(): number {
    this.decodeToken();
    return this.decodedToken?.exp || 0;
  }

  isTokenExpired(): boolean {
    const expiryTime = Number(this.getExpiryTime());
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    }

    return false;
  }
}
