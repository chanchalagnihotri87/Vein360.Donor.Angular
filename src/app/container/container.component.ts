import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { BreadcrumbService } from '../shared/breadcrumb/shared/breadcrumb.service';
import { ClinicService } from '../shared/clinic/clinic.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import ListItem from '../shared/list-item/list-tem.model';
import { MessageDisplayService } from '../shared/message-display/message-display.service';
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
    private clinicService: ClinicService,
    private msgDisplayService: MessageDisplayService,
  ) {}

  ngOnInit(): void {
    this.setBereadcrumb();
    this.loadContainerTypes();
    this.loadDonationContainers();
    this.loadClinics();
  }

  //#region  Public Methods

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
      initialState,
    );

    this.modelRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.modelRef.content.onSubmit.subscribe(
      (containerRequest: ContainerRequest) => {
        this.handleRequestForContainer(containerRequest);
        this.closeModal();
      },
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
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .deleteContainer(donationContainerId)
        .subscribe(() => {
          this.loadDonationContainers(() =>
            this.msgDisplayService.showSuccessMessage(
              'Container deleted successfully.',
            ),
          );
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
 5   this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes) => {
        console.log(containerTypes);
        this.containerTypes = containerTypes;
      });
  }

  private loadDonationContainers(callback?: () => void) {
    this.donationContainerService.getContainers().subscribe({
      next: (containers: DonationContainer[]) => {
        this.containers = containers.sort((a, b) => b.id - a.id); //To make containers list in descending order
        this.containersLoaded = true;
        if (callback) {
          callback();
        }
      },
      error: (err) => {
        this.msgDisplayService.showGeneralErrorMessage();
      },
    });
  }

  private handleRequestForContainer(containerRequest: ContainerRequest) {
    this.donationContainerService
      .requestForContainer(containerRequest)
      .subscribe(() => {
        this.loadDonationContainers(() =>
          this.msgDisplayService.showSuccessMessage(
            'Request sent successfully.',
          ),
        );
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
