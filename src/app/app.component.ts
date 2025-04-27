import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AuthService } from './login/shared/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, BreadcrumbComponent],
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
}
