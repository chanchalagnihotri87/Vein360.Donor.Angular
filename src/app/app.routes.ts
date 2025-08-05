import { Routes } from '@angular/router';
import { authGuard } from '../common/guards/auth.guard';
import { ssoGuard } from '../common/guards/sso.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContainerComponent } from './container/container.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';
import { SignleSignInComponent } from './signle-sign-in/signle-sign-in.component';

export const routes: Routes = [
  {
    path: '',
    component: DonationComponent,
    canActivate: [ssoGuard, authGuard],
    data: { donorOnly: true },
  },
  {
    path: 'container',
    component: ContainerComponent,
    canActivate: [authGuard],
    data: { donorOnly: true },
  },
  { path: 'login', component: LoginComponent },
  { path: 'sso/:id', component: SignleSignInComponent },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
];
