import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import AuthenticationResponse from './authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/accounts/donor`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  signIn(email: string, password: string) {
    return this.httpClient.post<AuthenticationResponse>(
      `${this.baseUrl}/signin`,
      {
        email: email,
        password: password,
      }
    );
  }
}
