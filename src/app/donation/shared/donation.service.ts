import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import DonationStatistic from './donation-statistic.model';
import Donation from './donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getDonations() {
    return this.httpClient.get<Donation[]>(this.baseUrl);
  }

  getDonationById(donationId: number) {
    return this.httpClient.get<Donation>(`${this.baseUrl}/${donationId}`);
  }

  addDonation(donation: Donation) {
    let donationData = {
      clinicId: donation.clinicId,
      trackingNumber: donation.trackingNumber,
      products: donation.products.map((product) => product),
    };

    return this.httpClient.post(this.baseUrl, donationData);
  }

  deleteDonation(donationId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${donationId}`);
  }

  getStatistic() {
    return this.httpClient.get<DonationStatistic>(`${this.baseUrl}/statistic`);
  }
}
