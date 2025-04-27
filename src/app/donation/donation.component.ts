import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { AddDonationComponent } from './add-donation/add-donation.component';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { DonationListComponent } from './donation-list/donation-list.component';

import { BreadcrumbItem } from '../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import DonationContainer from '../container/shared/donation-container.model';
import { DonationContainerService } from '../container/shared/donation-container.service';
import Donation from './shared/donation.model';
import { DonationService } from './shared/donation.service';
import Product from './shared/product.model';
import { ProductService } from './shared/product.service';

@Component({
  selector: 'app-donation',
  imports: [ReactiveFormsModule, DonationListComponent],
  templateUrl: './donation.component.html',
})
export class DonationComponent implements OnInit {
  private modelRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;
  private products: Product[] = [];
  private donationContainers: DonationContainer[] = [];

  protected donations: Donation[] = [];

  constructor(
    private modalService: BsModalService,
    private donationService: DonationService,
    private productService: ProductService,
    private containerService: DonationContainerService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadDonations();

    this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products;
    });

    this.containerService
      .getAvalableContainers()
      .subscribe((containers: DonationContainer[]) => {
        console.log(containers);
        this.donationContainers = containers;
      });

    this.breadcrumbService.breadcrumbs.set([
      new BreadcrumbItem('Donations', ''),
    ]);
  }

  showAddDonationModal() {
    const initialState: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        products: this.products,
        containers: this.donationContainers,
      },
    };
    this.modelRef = this.modalService.show(AddDonationComponent, initialState);
    this.modelRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.modelRef.content.onSubmit.subscribe((donation: Donation) => {
      this.handleAddDonation(donation);
      this.closeModal();
    });
  }

  handleAddDonation(dontaion: Donation) {
    this.donationService.addDonation(dontaion).subscribe(() => {
      this.loadDonations();
    });
  }

  handleShowDonationDetail(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      console.log(donation);
      this.openDonationDetailModal(donation);
    });
  }

  handleDeleteDonation(dontationId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this donation?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationService.deleteDonation(dontationId).subscribe(() => {
        this.loadDonations();
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  handleDispatchDonation(dontationId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to dispatch this donation?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationService.dispatchDonation(dontationId).subscribe(() => {
        this.loadDonations();
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  //#region  Privaate Methods
  private loadDonations() {
    this.donationService.getDonations().subscribe((donations) => {
      console.log(donations);
      this.donations = donations;
    });
  }

  private openDonationDetailModal(donation: Donation) {
    const configuartions: ModalOptions = {
      initialState: {
        donation: donation,
        products: this.products,
        containers: this.donationContainers,
      },
      class: 'modal-xl',
    };

    this.modelRef = this.modalService.show(
      DonationDetailComponent,
      configuartions
    );

    this.modelRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private closeModal() {
    this.modelRef?.hide();
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  //#endregion
}
