import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import AuthenticationResponse from '../../login/shared/authentication-response.model';

interface SSOResponse {
  redirectUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class SingleSignInService {
  private readonly baseUrl = `${environment.apiUrl}/sso`;

  constructor(private httpClient: HttpClient) {}

  signIn(id: string) {
    return this.httpClient.post<AuthenticationResponse>(
      `${this.baseUrl}/donor/signin/${id}`,
      {}
    );
  }
}
