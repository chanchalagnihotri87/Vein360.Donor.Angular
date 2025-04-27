import { Component, Input, OnInit, output } from '@angular/core';
import DonationContainer from '../../container/shared/donation-container.model';
import Donation from '../shared/donation.model';
import Product from '../shared/product.model';

@Component({
  selector: 'app-donation-detail',
  imports: [],
  templateUrl: './donation-detail.component.html',
})
export class DonationDetailComponent implements OnInit {
  onClose = output();

  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }
}
