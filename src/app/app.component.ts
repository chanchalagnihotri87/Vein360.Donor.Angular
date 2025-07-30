import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { AuthService } from './shared/login/shared/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, BreadcrumbComponent, LoaderComponent],
  providers: [BsModalService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Vein360.Donor';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  get userIsLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get userIsDonor() {
    return this.authService.isDonor();
  }
}
