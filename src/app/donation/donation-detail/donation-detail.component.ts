import { Component, Input, OnInit, output } from '@angular/core';
import ContainerListItem from '../../container/shared/container-list-item-model';
import DonationContainer from '../../container/shared/donation-container.model';
import { ContainerType } from '../../shared/enums/container-type.enum';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
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

  constructor(private fedexPackService: FedexService) {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get associatedContainers(): ContainerListItem[] {
    if (this.donation?.containerType === ContainerType.FedexContainer) {
      return this.fedexPacks.map(
        (pack) => new ContainerListItem(pack.id, pack.description)
      );
    }

    return this.containers.map(
      (item) =>
        new ContainerListItem(
          item.id,
          `#${item.id} ${item.containerType?.name} ${
            item.container?.containerCode
              ? `[${item.container?.containerCode}]`
              : ''
          }`
        )
    );
  }
}
