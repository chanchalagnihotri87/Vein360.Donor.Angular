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
  onDeleteClick = output<number>();

  constructor(private labelService: LabelService) {}

  public showDetail(donationId: number) {
    this.onDetailClick.emit(donationId);
  }

  public deleteDonation(donationId: number) {
    this.onDeleteClick.emit(donationId);
  }

  public downloadLabel(labelFileName: string) {
    this.labelService.getLabel(labelFileName).subscribe((labelData: Blob) => {
      this.labelService.downloadLabel(labelData, labelFileName);
    });
  }

  public convertToDate(date: string) {
    ConversionHelper.convertStringToDate(date);
  }

  get DonationStatus() {
    return DonationStatus;
  }
}
