import { Component, Input, OnInit, output } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import DonationContainer from '../../container/shared/donation-container.model';
import Donation from '../shared/donation.model';
import ListItem from '../shared/list-tem.model';

@Component({
  selector: 'app-donation-detail',
  imports: [PopoverModule],
  templateUrl: './donation-detail.component.html',
})
export class DonationDetailComponent implements OnInit {
  onClose = output();

  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) clinics: ListItem[] = [];
  @Input({ required: true }) products: ListItem[] = [];

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }
}
