import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../login/shared/account-service';
import { AuthService } from '../login/shared/auth.service';
import AuthenticationResponse from '../login/shared/authentication-response.model';
import { SingleSignInService } from './shared/single-sign-in.service';

@Component({
  selector: 'app-signle-sign-in',
  imports: [],
  templateUrl: './signle-sign-in.component.html',
  styleUrl: './signle-sign-in.component.scss',
})
export class SignleSignInComponent implements OnInit {
  id = input<string>('');

  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly singleSignInServie: SingleSignInService
  ) {}
  ngOnInit(): void {
    if (
      this.authService.isLoggedIn() &&
      this.authService.userId === this.id()
    ) {
      this.router.navigate(['']);
      return;
    }

    this.singleSignInServie.signIn(this.id()).subscribe({
      next: (authResponse: AuthenticationResponse) => {
        this.authService.logIn(authResponse);

        this.router.navigate(['']);
      },
      error: (error) => {
        this.router.navigate(['/login']);
      },
    });
  }
}
