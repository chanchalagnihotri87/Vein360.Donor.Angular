import Clinic from '../../donation/shared/clinic.model';
import { DonationContainerStatus } from '../../shared/enums/donation-container.status';
import ContainerType from './container-type.model';
import Vein360Container from './vein-360-container.model';

export default class DonationContainer {
  constructor(
    public id: number,
    public name: string,
    public containerType: ContainerType,
    public clinicId: number,
    public status: DonationContainerStatus,
    public trackingNumber: string,
    public createdDate: Date,
    public container?: Vein360Container,
    public requestedUnits: number = 0,
    public approvedUnits?: number,
    public clinic?: Clinic
  ) {}
}
