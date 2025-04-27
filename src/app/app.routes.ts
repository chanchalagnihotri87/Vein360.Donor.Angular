import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ContainerComponent } from './container/container.component';
import { DonationComponent } from './donation/donation.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: DonationComponent, canActivate: [authGuard] },
  {
    path: 'container',
    component: ContainerComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
];
