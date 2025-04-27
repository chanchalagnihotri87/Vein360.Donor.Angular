import { DatePipe } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DonationContainerStatus } from '../../shared/enums/donation-container.status';
import DonationContainer from '../shared/donation-container.model';

@Component({
  selector: 'app-container-list',
  imports: [DatePipe, TooltipModule],
  templateUrl: './container-list.component.html',
})
export class ContainerListComponent {
  @Input({ required: true }) containers: DonationContainer[] = [];

  onDelete = output<number>();
  onReceive = output<number>();

  get ContainerStatus() {
    return DonationContainerStatus;
  }

  handleDeleteContainer(containerId: number) {
    this.onDelete.emit(containerId);
  }

  handleReceivedContainer(containerId: number) {
    this.onReceive.emit(containerId);
  }
}
