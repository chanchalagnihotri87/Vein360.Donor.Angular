import PagedResponse from '../paged-response/paged-response';
import Donation from './donation.model';

export default class PagedDonationsResponse extends PagedResponse<Donation> {
  constructor(items: Donation[], totalPages: number, currentPage: number) {
    super(items, totalPages, currentPage);
  }
}
