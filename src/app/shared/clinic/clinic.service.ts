import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import ListItem from '../list-item/list-tem.model';
import Clinic from './clinic.model';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private readonly baseUrl = `${environment.apiUrl}/clinics`;

  constructor(private httpClient: HttpClient) {}

  getClinicsList() {
    return this.httpClient.get<ListItem[]>(`${this.baseUrl}/list`);
  }

  getMyClinics() {
    return this.httpClient.get<Clinic[]>(`${this.baseUrl}/myclinics`);
  }
}
