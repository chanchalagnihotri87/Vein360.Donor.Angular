import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessageComponent } from '../shared/validation-message/validation-message.component';
import { AccountService } from './shared/account-service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.valid) {
      this.accountService
        .signIn(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (token: string) => {
            debugger;
            console.log(token);

            this.authService.logIn(token);
            this.router.navigate(['']);
          },
          (error) => {
            console.log(error);
            alert('You email & password are not valid.');
          }
        );
    }
  }
}
