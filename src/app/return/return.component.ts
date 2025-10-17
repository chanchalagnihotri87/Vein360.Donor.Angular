import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UserProduct } from '../home/shared/user-product.model';
import { UserProductService } from '../home/shared/user-product.service';
import { AddressComponent } from '../shared/address/address.component';
import { BaseComponent } from '../shared/base-component';
import { BreadcrumbItem } from '../shared/breadcrumb/shared/breadcrumb-item.model';
import Clinic from '../shared/clinic/clinic.model';
import { ClinicService } from '../shared/clinic/clinic.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { DocumentService } from '../shared/document/document.service';
import Donation from '../shared/donation/donation.model';
import { DonationService } from '../shared/donation/donation.service';
import { DonationStatus } from '../shared/enums/dontainer-status.enum';
import { ProductType } from '../shared/enums/product-type.enum';
import { ProductCategoryService } from '../shared/product/product-category.service';
import { ReturnControlComponent } from './return-control/return-control.component';

@Component({
  selector: 'app-return',
  imports: [TooltipModule, DatePipe, AddressComponent],
  templateUrl: './return.component.html',
  styleUrl: './return.component.scss',
})
export class ReturnComponent extends BaseComponent implements OnInit {
  private confirmationModal?: BsModalRef;
  private repeatReturnModal?: BsModalRef;

  protected donations: Donation[] = [];
  protected donationLoaded = false;
  protected clinics: Clinic[] = [];

  constructor(
    private readonly router: Router,
    private readonly modalService: BsModalService,
    private readonly clinicService: ClinicService,
    private readonly donationService: DonationService,
    private readonly documentService: DocumentService,
    private readonly userProductService: UserProductService,
    private readonly productCategoryService: ProductCategoryService
  ) {
    super();

    this.setBereadcrumb([new BreadcrumbItem('Returns', '')]);
  }

  ngOnInit(): void {
    this.loadDonations();
    this.loadClinics();
  }

  //#region Public Methods
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

  public downloadLabel(labelFileName: string) {
    this.documentService
      .getLabel(labelFileName)
      .subscribe((labelData: Blob) => {
        this.documentService.downloadLabel(labelData, labelFileName);
      });
  }

  protected repeatReturn(donation: Donation, event: Event) {
    this.hideButtonTooltip(event);

    this.userProductService
      .getProduct(donation.donationProduct!.productId)
      .subscribe((product) => {
        this.showReturnNowModal(product, donation);
      });
  }

  //#endregion

  //#region Private Methods

  private loadClinics() {
    this.clinicService.getMyClinics().subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  private loadDonations() {
    this.donationService.getDonations().subscribe((donations) => {
      this.donations = donations;
      this.donationLoaded = true;
    });
  }

  private showReturnNowModal(product: UserProduct, donation: Donation) {
    this.repeatReturnModal = this.modalService.show(ReturnControlComponent, {
      initialState: {
        title: 'Confirmation',
        product: product,
        clinics: this.clinics,
        donation: donation,
      },
      backdrop: 'static',
    });

    this.repeatReturnModal.content.onClose.subscribe(() => {
      this.closeReturnNowModal();
    });

    this.repeatReturnModal.content.onSubmit.subscribe((donation: Donation) => {
      this.donationService.addDonation(donation).subscribe(() => {
        this.closeReturnNowModal();
        this.loadDonations();
      });
    });
  }

  private closeReturnNowModal() {
    this.repeatReturnModal?.hide();
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

  //#endregion
}
