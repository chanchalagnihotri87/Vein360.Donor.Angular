import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ContainerComponent } from './donor/container/container.component';
import { DonationComponent } from './donor/donation/donation.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

import { HomeComponent } from './buyer/home/home.component';
import { OrderComponent } from './buyer/order/order.component';
import { LoginComponent } from './shared/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'donations',
    component: DonationComponent,
    canActivate: [authGuard],
    data: { donorOnly: true },
  },
  {
    path: 'container',
    component: ContainerComponent,
    canActivate: [authGuard],
    data: { donorOnly: true },
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard],
  },
];
