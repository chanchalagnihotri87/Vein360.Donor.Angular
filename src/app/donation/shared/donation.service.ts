import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../login/shared/auth.service';
import Donation from './donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`; // Replace with your API URL

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getDonations() {
    return this.httpClient.get<Donation[]>(this.baseUrl);
  }

  getDonationById(donationId: number) {
    return this.httpClient.get<Donation>(`${this.baseUrl}/${donationId}`);
  }

  addDonation(donation: Donation) {
    let donationData = {
      containerType: donation.containerType,
      containerId: donation.containerId,
      weight: donation.weight,
      products: donation.products.map((product) => product),
    };

    return this.httpClient.post(this.baseUrl, donationData);
  }

  deleteDonation(donationId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${donationId}`);
  }

  dispatchDonation(donationId: number) {
    return this.httpClient.patch(`${this.baseUrl}/dispatch/${donationId}`, {});
  }
}
