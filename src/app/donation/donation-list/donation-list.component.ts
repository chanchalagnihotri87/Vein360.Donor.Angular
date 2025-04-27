import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import ConversionHelper from '../../../common/conversion-helpter';
import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import Donation from '../shared/donation.model';
import { LabelService } from '../shared/label.service';

@Component({
  selector: 'app-donation-list',
  imports: [DatePipe, TooltipModule],
  templateUrl: './donation-list.component.html',
  standalone: true,
})
export class DonationListComponent {
  donations = input.required<Donation[]>();

  onDetailClick = output<number>();
  onDispatchClick = output<number>();
  onDeleteClick = output<number>();

  constructor(private labelService: LabelService) {}

  protected showDetail(donationId: number) {
    this.onDetailClick.emit(donationId);
  }

  protected deleteDonation(donationId: number) {
    this.onDeleteClick.emit(donationId);
  }

  protected dispatchDonation(donationId: number) {
    this.onDispatchClick.emit(donationId);
  }

  protected downloadLabel(labelFileName: string) {
    this.labelService.getLabel(labelFileName).subscribe((labelData: Blob) => {
      this.labelService.downloadLabel(labelData, labelFileName);
    });
  }

  protected convertToDate(date: string) {
    ConversionHelper.convertStringToDate(date);
  }

  get DonationStatus() {
    return DonationStatus;
  }
}
