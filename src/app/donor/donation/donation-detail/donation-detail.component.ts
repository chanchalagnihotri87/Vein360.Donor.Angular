import { Component, Input, OnInit, output } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PackageType } from '../../../shared/enums/package-type.enum';
import ContainerListItem from '../../container/shared/container-list-item-model';
import DonationContainer from '../../container/shared/donation-container.model';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
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

  constructor(private fedexPackService: FedexService) {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get associatedContainers(): ContainerListItem[] {
    if (this.donation?.packageType === PackageType.FedexPackage) {
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

  get ContainerType() {
    return PackageType;
  }

  public GetPackageTypeDescription(packageType?: number) {
    if (packageType) {
      switch (packageType) {
        case PackageType.CustomPackage:
          return 'Custom Package ';

        case PackageType.Vein360Container:
          return ' Vein360 Container';

        case PackageType.FedexPackage:
          return 'Fedex Package';
      }
    }

    return '';
  }

  public GetFedexPackageDescription(fedexPackagingTypeId?: number) {
    if (fedexPackagingTypeId) {
      return this.fedexPackService.GetFedexPackDescription(fedexPackagingTypeId)
        ?.description;
    }

    return '';
  }
}
