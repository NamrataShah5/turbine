import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { loginRouting } from './login.routing';
import { LoginPageComponent } from './pages/login/login-page.component';

@NgModule({
  declarations: [LoginPageComponent, LoginComponent],
  imports: [ReactiveFormsModule, CommonModule, StoriesModule, SharedModule, loginRouting],
  exports: [LoginComponent, LoginPageComponent],
})
export class LoginModule {}
