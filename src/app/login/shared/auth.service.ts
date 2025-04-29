import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = signal<boolean>(false);
  private access_Token = signal<string | undefined>(undefined);
  constructor() {}

  public logIn(token: string) {
    this.loggedIn.set(true);
    this.access_Token.set(token);
  }

  public logOut() {
    this.loggedIn.set(false);
  }

  public get isLoggedIn() {
    return this.loggedIn.asReadonly();
  }

  public get token() {
    return this.access_Token.asReadonly();
  }
}
