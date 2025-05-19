import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenItemName: string = 'vein-360-donor-token';
  private loggedIn = signal<boolean>(false);
  private access_Token = signal<string | undefined>(undefined);
  constructor() {
    if (localStorage.getItem(this.tokenItemName)) {
      this.access_Token.set(localStorage.getItem(this.tokenItemName)!);
      this.loggedIn.set(true);
    }
  }

  public logIn(token: string) {
    localStorage.setItem(this.tokenItemName, token);
    this.loggedIn.set(true);
    this.access_Token.set(token);
  }

  public logOut() {
    localStorage.removeItem(this.tokenItemName);
    this.access_Token.set(undefined);
    this.loggedIn.set(false);
  }

  //#region Get Properties
  public get isLoggedIn() {
    return this.loggedIn.asReadonly();
  }

  public get token() {
    return this.access_Token.asReadonly();
  }

  //#endregion
}
