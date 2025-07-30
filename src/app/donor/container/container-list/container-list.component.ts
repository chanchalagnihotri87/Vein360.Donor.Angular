import { DatePipe } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DonationContainerStatus } from '../../../shared/enums/donation-container.status';
import DonationContainer from '../shared/donation-container.model';

@Component({
  selector: 'app-container-list',
  imports: [DatePipe, TooltipModule],
  templateUrl: './container-list.component.html',
})
export class ContainerListComponent {
  @Input({ required: true }) containers: DonationContainer[] = [];

  onDelete = output<number>();

  //#region  Protected Methods

  protected handleDeleteContainer(containerId: number) {
    this.onDelete.emit(containerId);
  }

  //#endregion

  //#region Get Properties
  get ContainerStatus() {
    return DonationContainerStatus;
  }

  //#endregion
}
