import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Donation from '../donation/donation.model';
import DonationStatistic from './donation-statistic.model';
import PagedDonationsResponse from './paged-donation-response';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`;

  constructor(private httpClient: HttpClient) {}

  getDonations(pageNo: number) {
    console.log('Going to load donation with pageNo: ' + pageNo);
    return this.httpClient.get<PagedDonationsResponse>(
      `${this.baseUrl}?page=${pageNo}`,
    );
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

    console.log('Donation Data:');
    console.log(donationData);

    return this.httpClient.post(this.baseUrl, donationData);
  }

  deleteDonation(donationId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${donationId}`);
  }

  getStatistic() {
    return this.httpClient.get<DonationStatistic>(`${this.baseUrl}/statistic`);
  }
}
