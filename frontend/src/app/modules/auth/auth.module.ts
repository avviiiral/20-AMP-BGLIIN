import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { OtpLoginComponent } from './otp-login/otp-login.component';
import { RegisterSchoolComponent } from './register-school/register-school.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    OtpLoginComponent,
    RegisterSchoolComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
