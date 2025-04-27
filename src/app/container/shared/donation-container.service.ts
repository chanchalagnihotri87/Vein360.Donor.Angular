import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import DonationContainer from './donation-container.model';

@Injectable({
  providedIn: 'root',
})
export class DonationContainerService {
  private readonly baseUrl = `${environment.apiUrl}/donationcontainers`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getContainers(): Observable<DonationContainer[]> {
    return this.httpClient.get<DonationContainer[]>(this.baseUrl);
  }

  getAvalableContainers(): Observable<DonationContainer[]> {
    return this.httpClient.get<DonationContainer[]>(
      `${this.baseUrl}/available`
    );
  }

  requestForContainer(containerTypeId: number) {
    return this.httpClient.post(`${this.baseUrl}/${containerTypeId}`, {});
  }

  deleteContainer(donationContainerId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${donationContainerId}`);
  }

  receiveContainer(donationContainerId: number) {
    return this.httpClient.patch(
      `${this.baseUrl}/receive/${donationContainerId}`,
      {}
    );
  }
}
