import { Injectable, signal } from '@angular/core';
import ConversionHelper from '../../../common/conversion-helpter';
import AuthConstants from './auth-constants.model';
import AuthenticationResponse from './authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = signal<boolean>(false);
  private access_Token = signal<string | undefined>(undefined);
  private default_Clinic_Id = signal<number | undefined>(undefined);
  constructor() {
    if (localStorage.getItem(AuthConstants.tokenItemName)) {
      this.access_Token.set(localStorage.getItem(AuthConstants.tokenItemName)!);
      this.loggedIn.set(true);
    }

    if (
      localStorage.getItem(AuthConstants.defaultClinicIdItemName) &&
      localStorage.getItem(AuthConstants.defaultClinicIdItemName) != null
    ) {
      this.default_Clinic_Id.set(
        ConversionHelper.convertToInt(
          localStorage.getItem(AuthConstants.defaultClinicIdItemName)
        )
      );
    }
  }

  // public logIn(token: string) {
  //   localStorage.setItem(this.tokenItemName, token);
  //   this.loggedIn.set(true);
  //   this.access_Token.set(token);
  // }

  public logIn(authResponse: AuthenticationResponse) {
    localStorage.setItem(AuthConstants.tokenItemName, authResponse.token);
    this.loggedIn.set(true);
    this.access_Token.set(authResponse.token);

    if (authResponse.preference && authResponse.preference.defaultClinicId) {
      localStorage.setItem(
        AuthConstants.defaultClinicIdItemName,
        authResponse.preference.defaultClinicId.toString()
      );

      this.default_Clinic_Id.set(authResponse.preference.defaultClinicId);
    }
  }

  public logOut() {
    localStorage.removeItem(AuthConstants.tokenItemName);
    localStorage.removeItem(AuthConstants.defaultClinicIdItemName);
    this.access_Token.set(undefined);
    this.default_Clinic_Id.set(undefined);
    this.loggedIn.set(false);
  }

  //#region Get Properties
  public get isLoggedIn() {
    return this.loggedIn.asReadonly();
  }

  public get token() {
    return this.access_Token.asReadonly();
  }

  public get defaultClinicId() {
    return this.default_Clinic_Id.asReadonly();
  }

  //#endregion
}
