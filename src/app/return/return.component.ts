import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import Donation from '../donation/shared/donation.model';
import { DonationService } from '../donation/shared/donation.service';
import { ProductCategoryService } from '../donation/shared/product-category.service';
import { AddressComponent } from '../shared/address/address.component';
import { BaseComponent } from '../shared/base-component';
import { BreadcrumbItem } from '../shared/breadcrumb/shared/breadcrumb-item.model';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { DonationStatus } from '../shared/enums/dontainer-status.enum';
import { ProductType } from '../shared/enums/product-type.enum';

@Component({
  selector: 'app-return',
  imports: [TooltipModule, DatePipe, AddressComponent],
  templateUrl: './return.component.html',
  styleUrl: './return.component.scss',
})
export class ReturnComponent extends BaseComponent implements OnInit {
  protected donations: Donation[] = [];
  protected donationLoaded = false;

  private confirmationModal?: BsModalRef;

  constructor(
    private readonly modalService: BsModalService,
    private readonly donationService: DonationService,
    private readonly productCategoryService: ProductCategoryService
  ) {
    super();

    this.setBereadcrumb([new BreadcrumbItem('Returns', '')]);
  }

  ngOnInit(): void {
    this.loadDonations();
  }

  private loadDonations() {
    this.donationService.getDonations().subscribe((donations) => {
      this.donations = donations;
      this.donationLoaded = true;
    });
  }

  protected getCategoryDescription(category?: ProductType) {
    return this.productCategoryService.getCategoryString(category);
  }

  protected getDonationStatusDescription(status?: DonationStatus) {
    if (status) {
      return DonationStatus[status];
    }

    return '';
  }

  protected isNotProcessed(donation: Donation) {
    return donation.status == DonationStatus.Returned;
  }

  protected isProcessed(donation: Donation) {
    return donation.status != DonationStatus.Returned;
  }

  protected deleteReturn(donation: Donation, event: Event) {
    this.hideButtonTooltip(event);

    this.confirmationModal = this.modalService.show(
      ConfirmationMessageComponent,
      {
        initialState: {
          message: 'Are you sure you want to delete this return?',
        },
        class: 'modal-md',
      }
    );

    this.confirmationModal.content.onYes.subscribe(() => {
      this.donationService.deleteDonation(donation.id).subscribe(() => {
        this.donations.splice(this.donations.indexOf(donation), 1);
      });

      this.hideConfirmationModal();
    });

    this.confirmationModal.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModal?.hide();
  }
}
