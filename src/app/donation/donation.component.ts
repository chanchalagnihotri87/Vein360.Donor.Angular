import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { AddDonationComponent } from './add-donation/add-donation.component';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { DonationListComponent } from './donation-list/donation-list.component';

import { CurrencyPipe } from '@angular/common';
import { BreadcrumbItem } from '../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import ContainerType from '../container/shared/container-type.model';
import { ContatinerTypeService } from '../container/shared/contatiner-type.service';
import DonationContainer from '../container/shared/donation-container.model';
import { DonationContainerService } from '../container/shared/donation-container.service';
import { ClinicService } from './shared/clinic.service';
import DonationStatistic from './shared/donation-statistic.model';
import Donation from './shared/donation.model';
import { DonationService } from './shared/donation.service';
import ListItem from './shared/list-tem.model';
import { ProductService } from './shared/product.service';

@Component({
  selector: 'app-donation',
  imports: [ReactiveFormsModule, DonationListComponent, CurrencyPipe],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss',
})
export class DonationComponent implements OnInit {
  private donationModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;
  private products: ListItem[] = [];
  private donationContainers: DonationContainer[] = [];
  private containerTypes: ContainerType[] = [];
  private clinics: ListItem[] = [];

  protected donations: Donation[] = [];
  public donationStatistic?: DonationStatistic;

  constructor(
    private modalService: BsModalService,
    private donationService: DonationService,
    private productService: ProductService,
    private containerService: DonationContainerService,
    private breadcrumbService: BreadcrumbService,
    private containerTypeService: ContatinerTypeService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadDonations();
    this.loadContainers();
    this.setBreadcrumb();
    this.loadStatistic();
    this.loadContainerTypes();
    this.loadClinics();
  }

  //#region Add Donation

  showAddDonationModal() {
    const initialState: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        products: this.products,
        containerTypes: this.containerTypes,
        clinics: this.clinics,
      },
    };
    this.donationModalRef = this.modalService.show(
      AddDonationComponent,
      initialState
    );
    this.donationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.donationModalRef.content.onSubmit.subscribe((donation: Donation) => {
      this.handleAddDonation(donation);
      this.closeModal();
    });
  }

  handleAddDonation(dontaion: Donation) {
    this.donationService.addDonation(dontaion).subscribe(() => {
      this.loadDonations();
      this.loadStatistic();
    });
  }

  //#endregion

  //#region Donation Detail
  handleShowDonationDetail(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      console.log(donation);
      this.showDonationDetailModal(donation);
    });
  }

  private showDonationDetailModal(donation: Donation) {
    const configuartions: ModalOptions = {
      initialState: {
        donation,
        products: this.products,
        containers: this.donationContainers,
      },
      class: 'modal-xl',
    };

    this.donationModalRef = this.modalService.show(
      DonationDetailComponent,
      configuartions
    );

    this.donationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  //#endregion

  //#region Delete Donation
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
        this.loadStatistic();
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  //#endregion

  //#region Private Methods
  private loadDonations() {
    this.donationService.getDonations().subscribe((donations) => {
      console.log(donations);
      this.donations = donations;
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      new BreadcrumbItem('Donations', ''),
    ]);
  }

  private loadContainers() {
    this.containerService
      .getContainers()
      .subscribe((containers: DonationContainer[]) => {
        console.log(containers);
        this.donationContainers = containers;
      });
  }

  private loadProducts() {
    this.productService.getProductList().subscribe((products) => {
      console.log(products);
      this.products = products;
    });
  }

  private loadStatistic() {
    this.donationService.getStatistic().subscribe((statistic) => {
      this.donationStatistic = statistic;
    });
  }

  private closeModal() {
    this.donationModalRef?.hide();
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private loadContainerTypes() {
    this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes) => {
        this.containerTypes = containerTypes;
      });
  }

  private loadClinics() {
    this.clinicService.getClinicsList().subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  //#endregion
}
