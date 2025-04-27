import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = signal<boolean>(false);
  constructor() {}

  public get isLoggedIn() {
    return this.loggedIn.asReadonly();
  }

  public logIn() {
    this.loggedIn.set(true);
  }

  public logOut() {
    this.loggedIn.set(false);
  }
}
