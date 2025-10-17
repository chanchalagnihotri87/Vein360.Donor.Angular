import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private readonly baseUrl = `${environment.apiUrl}/labels`;

  constructor(private httpClient: HttpClient) {}

  getLabels(clinicId: number) {
    return this.httpClient.get<string[]>(`${this.baseUrl}/list/${clinicId}`);
  }
}
