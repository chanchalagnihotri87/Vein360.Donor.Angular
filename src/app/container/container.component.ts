import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ClinicService } from '../donation/shared/clinic.service';
import ListItem from '../donation/shared/list-tem.model';
import { BreadcrumbService } from '../shared/breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ContainerListComponent } from './container-list/container-list.component';
import { RequestContainerComponent } from './request-container/request-container.component';
import ContainerRequest from './shared/container-request.model';
import ContainerType from './shared/container-type.model';
import { ContatinerTypeService } from './shared/contatiner-type.service';
import DonationContainer from './shared/donation-container.model';
import { DonationContainerService } from './shared/donation-container.service';

@Component({
  selector: 'app-container',
  imports: [ContainerListComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class ContainerComponent implements OnInit {
  protected containers: DonationContainer[] = [];
  protected containerTypes: ContainerType[] = [];
  protected containersLoaded = false;

  private clinics: ListItem[] = [];

  private modelRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private breadcrumbService: BreadcrumbService,
    private containerTypeService: ContatinerTypeService,
    private donationContainerService: DonationContainerService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.setBereadcrumb();
    this.loadContainerTypes();
    this.loadDonationContainers();
    this.loadClinics();
  }

  //#region  Protected Methods

  protected showRequestContainerModal() {
    const initialState: ModalOptions = {
      class: 'modal-md',
      initialState: {
        containerTypes: this.containerTypes,
        clinics: this.clinics,
      },
    };
    this.modelRef = this.modalService.show(
      RequestContainerComponent,
      initialState
    );

    this.modelRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.modelRef.content.onSubmit.subscribe(
      (containerRequest: ContainerRequest) => {
        this.handleRequestForContainer(containerRequest);
        this.closeModal();
      }
    );
  }

  protected handleDeleteContainer(donationContainerId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this container?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .deleteContainer(donationContainerId)
        .subscribe(() => {
          this.loadDonationContainers();
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  //#endregion

  //#region Private Methods

  private setBereadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      { label: 'Containers', path: '/containers' },
    ]);
  }

  private loadContainerTypes() {
    this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes) => {
        console.log(containerTypes);
        this.containerTypes = containerTypes;
      });
  }

  private loadDonationContainers() {
    this.donationContainerService.getContainers().subscribe({
      next: (containers: DonationContainer[]) => {
        this.containers = containers.sort((a, b) => b.id - a.id); //To make containers list in descending order
        this.containersLoaded = true;
      },
      error: (err) => {
        console.error('Failed to load containers:', err);
      },
    });
  }

  private handleRequestForContainer(containerRequest: ContainerRequest) {
    this.donationContainerService
      .requestForContainer(containerRequest)
      .subscribe(() => {
        this.loadDonationContainers();
      });
  }

  private closeModal() {
    this.modelRef?.hide();
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private loadClinics() {
    this.clinicService.getClinicsList().subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  //#endregion
}
