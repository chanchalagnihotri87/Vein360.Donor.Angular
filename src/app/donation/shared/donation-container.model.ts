import { DonationContainerStatus } from '../../shared/enums/donation-container-status.enum';

export default class DonationContainer {
  constructor(
    public id: number,
    public containerTypeId: number,
    public status: DonationContainerStatus,
    public containerCode: string
  ) {}
}
