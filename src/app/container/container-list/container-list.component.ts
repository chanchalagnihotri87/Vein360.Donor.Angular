import { DatePipe } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DonationContainerStatus } from '../../shared/enums/donation-container-status.enum';
import DonationContainer from '../shared/donation-container.model';

@Component({
  selector: 'app-container-list',
  imports: [DatePipe, TooltipModule],
  templateUrl: './container-list.component.html',
})
export class ContainerListComponent {
  @Input({ required: true }) containers: DonationContainer[] = [];

  public onDelete = output<number>();

  get ContainerStatus() {
    return DonationContainerStatus;
  }

  //#region  Public Methods

  protected handleDeleteContainer(containerId: number) {
    this.onDelete.emit(containerId);
  }

  //#endregion
}
