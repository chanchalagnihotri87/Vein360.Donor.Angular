import { DonationContainerStatus } from '../../shared/enums/donation-container-status.enum';

export default class DonationContainer {
  id: number;
  containerTypeId: number;
  status: DonationContainerStatus;
  containerCode: string;

  constructor(
    id: number,
    containerTypeId: number,
    status: DonationContainerStatus,
    containerCode: string
  ) {
    this.id = id;
    this.containerTypeId = containerTypeId;
    this.status = status;
    this.containerCode = containerCode;
  }
}
