import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'toboggan-ws-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  
  constructor(private auth: AuthService) {}

  signinWithGoogle() {
    this.auth.ssoAuth();
  }


  signinWithCredentials() {
    this.auth.loginWithCreds(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
}
