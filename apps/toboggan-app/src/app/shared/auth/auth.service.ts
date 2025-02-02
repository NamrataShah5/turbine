/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IUser } from '@toboggan-ws/toboggan-common';
import * as firebase from 'firebase/app';
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { JWTToken } from 'libs/jwttoken/jwttoken';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ModalAlertService } from '../services/modal-alert/modal-alert.service';
import { ActivityMonitorService } from './activity-monitor.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly app;
  private readonly auth;

  private ssoIdToken = '';
  private jwtSso: JWTToken | null | undefined;

  constructor(
    private activityMonitor: ActivityMonitorService,
    public afAuth: AngularFireAuth,
    public modalAlertService: ModalAlertService,
    private router: Router,
    private http: HttpClient
  ) {
    this.app = firebase.initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    const ssoIdToken = localStorage.getItem('ssoIdToken');
    const lastActivity = localStorage.getItem('lastActivity');

    if (ssoIdToken) {
      this.setSsoTokenJwt(ssoIdToken);
    }

    this.afAuth.authState.subscribe((user) => {
      if (!user) {
        return;
      }
      const currentUser = JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      });
      localStorage.setItem('currentUser', currentUser);
      this.activityMonitor.user.action = lastActivity
        ? Number(lastActivity)
        : Date.now();

      this.activityMonitor.subscribe('inactive', this.signOut.bind(this));
      this.activityMonitor.subscribe(
        'keepAlive',
        this.refreshTokensJwts.bind(this)
      );
      this.activityMonitor.subscribe(
        'warning',
        this.showNoActivityWarning.bind(this)
      );
      this.activityMonitor.subscribe(
        'activity',
        this.onActivityMonitor.bind(this)
      );
    });
  }

  showNoActivityWarning = () => {
    const timeout = this.activityMonitor.options.warning / 60;

    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: 'Warning',
      message: `If there is no activity for the next ${timeout} minutes, you will be logged out!`,
      buttons: [
        {
          title: 'Close',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'primary',
        },
      ],
    });
  };

  onActivityMonitor = () => {
    localStorage.setItem(
      'lastActivity',
      String(this.activityMonitor.user.action)
    );
  };

  ssoAuth = async () => {
    const provider = new OAuthProvider(environment.providerID);

    try {
      const result = await signInWithPopup(this.auth, provider);

      const credential = OAuthProvider.credentialFromResult(result);
      if (credential !== null) {
        const idToken = credential.idToken ?? '';
        this.getLatestSession(idToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  removeTokenJwts() {
    [this.ssoIdToken, this.jwtSso] = ['', null];
    ['jwtSso', 'ssoIdToken', 'currentUser'].map((key) =>
      localStorage.removeItem(key)
    );
  }

  refreshTokensJwts() {
    this.auth.currentUser
      ?.getIdToken(true)
      .then((idToken) => {
        this.setSsoTokenJwt(idToken);
      })
      .catch((error) => {
        console.error('error', error);
      });
  }

  setSsoTokenJwt(ssoIdToken: string) {
    this.ssoIdToken = ssoIdToken;
    this.jwtSso = new JWTToken(ssoIdToken);
    this.jwtSso.decodeToken();

    localStorage.setItem('ssoIdToken', this.ssoIdToken);
    localStorage.setItem('jwtSso', JSON.stringify(this.jwtSso, null, 2));

    if (!environment.production) {
      console.log(
        `idTokenSSO-poc\n%c${JSON.stringify(this.jwtSso)}`,
        'color:pink'
      );
      this.setCookie('firebaseIdToken', this.jwtSso?.jwtToken);
    }
  }

  // should only be used in dev mode to work with postman interceptor
  setCookie(name: string, val: string): void {
    const expiryDate = new Date();
    // 1 hour validity
    expiryDate.setTime(expiryDate.getTime() + 3600);
    const ck = `${name}=${val}; expires=${expiryDate.toUTCString()}; SameSite=None; SameSite=Secure; path=/`;
    document.cookie = ck;
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.removeTokenJwts();
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('IDP-Override');

      this.activityMonitor.unsubscribe('inactive', this.signOut.bind(this));
      this.activityMonitor.unsubscribe(
        'keepAlive',
        this.refreshTokensJwts.bind(this)
      );
      this.activityMonitor.unsubscribe(
        'warning',
        this.showNoActivityWarning.bind(this)
      );
      this.activityMonitor.unsubscribe(
        'activity',
        this.onActivityMonitor.bind(this)
      );

      this.modalAlertService.hideModalAlert();
      this.router.navigate(['login']);
    });
  }

  get authBearerToken(): string | undefined {
    return this.jwtSso?.jwtToken;
  }

  //to retrieve loggedInUser Details from token
  get loggedInUser() {
    const userDetails = this.jwtSso?.decodeToken();
    const user = {
      firstName: userDetails?.['given_name'],
      lastName: userDetails?.['family_name'],
      email: userDetails?.['email'],
    };
    return user as Partial<IUser>;
  }

  // TODO
  // can probably be done better using the observable provided in firebase
  // will revisit
  get isSignedIn(): boolean {
    return Boolean(this.jwtSso && !this.jwtSso.isTokenExpired());
  }

  get currentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) return JSON.parse(currentUser);
  }

  loginWithCreds = async (email: string, password: string) => {
    try {
      localStorage.setItem('IDP-Override', 'true');
      const data: any = await firstValueFrom(
        this.http.post(`api/authentication/login-with-creds`, {
          email: email,
          password: password,
        })
      );
      if (data !== null) {
        const idToken = data?.idToken ?? '';
        this.setSsoTokenJwt(idToken);
      }
      await this.router.navigate(['']);
    } catch (error) {
      console.error(error);
    }
  };

  getLatestSession = async (idToken: string) => {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      });
      const data: any = await firstValueFrom(
        this.http.get('/api/authentication/latest-session', {
          headers: headers,
        })
      );
      this.setSsoTokenJwt(data?.userSession?.idToken);
      localStorage.setItem('IDP-Override', 'false');
      localStorage.setItem(
        'userSession',
        JSON.stringify(data?.userSession, null, 2)
      );

      await this.router.navigate(['']);
    } catch (error) {
      console.error(error);
    }
  };

  getSessionId() {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        return JSON.parse(userSession)?.session_id;
      } catch (e) {
        console.error(e);
      }
    }
  }
}
