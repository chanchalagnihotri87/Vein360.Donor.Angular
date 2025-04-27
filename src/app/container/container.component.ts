import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ContainerListComponent } from './container-list/container-list.component';
import { RequestForContainerComponent } from './request-for-container/request-for-container.component';
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
  private modelRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  protected containers: DonationContainer[] = [];
  protected containerTypes: ContainerType[] = [];

  constructor(
    private donationContainerService: DonationContainerService,
    private breadcrumbService: BreadcrumbService,
    private modalService: BsModalService,
    private containerTypeService: ContatinerTypeService
  ) {}
  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs.set([
      { label: 'Containers', path: '/containers' },
    ]);

    this.loadDonationContainers();

    this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes) => {
        console.log(containerTypes);
        this.containerTypes = containerTypes;
      });
  }

  showRequestContainerModal() {
    const initialState: ModalOptions = {
      class: 'modal-md',
      initialState: { containerTypes: this.containerTypes },
    };
    this.modelRef = this.modalService.show(
      RequestForContainerComponent,
      initialState
    );

    this.modelRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.modelRef.content.onSubmit.subscribe((containerTypeId: number) => {
      this.handleRequestForContainer(containerTypeId);
      this.closeModal();
    });
  }

  handleRequestForContainer(containerTypeId: number) {
    this.donationContainerService
      .requestForContainer(containerTypeId)
      .subscribe(() => {
        this.loadDonationContainers();
      });
  }

  handleDeleteContainer(donationContainerId: number) {
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

  handleReceiveContainer(donationContainerId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you have received this container?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .receiveContainer(donationContainerId)
        .subscribe(() => {
          this.loadDonationContainers();
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  private closeModal() {
    this.modelRef?.hide();
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private loadDonationContainers() {
    this.donationContainerService.getContainers().subscribe({
      next: (containers: DonationContainer[]) => {
        console.log(containers);
        this.containers = containers;
      },
      error: (err) => {
        console.error('Failed to load containers:', err);
      },
    });
  }
}
