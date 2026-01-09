import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Donation from '../donation/donation.model';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  reschedulePickup(donationId: number) {
    return this.httpClient.patch<Donation>(
      `${this.baseUrl}/donations/${donationId}/pickup/reschedule`,
      {}
    );
  }
}
