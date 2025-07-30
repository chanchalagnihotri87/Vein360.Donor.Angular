import { DonationStatus } from '../../../shared/enums/dontainer-status.enum';
import ContainerType from '../../container/shared/container-type.model';
import Clinic from './clinic.model';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  clinicId: number;
  packageType: number;
  containerTypeId?: number;
  fedexPackagingTypeId?: number;
  productTypes: string[] = [];
  trackingNumber?: string;
  useOldLabel: boolean = false;
  labelFileName: string = '';
  labelPath?: string;
  createdDate: Date = new Date();
  status: DonationStatus = DonationStatus.Donated;

  products: DonationProduct[];
  containerType?: ContainerType; // This will be set later when the container is fetched

  clinic?: Clinic;

  constructor(
    clinicId: number,
    packageType: number,
    products: DonationProduct[],
    containerTypeId?: number,
    fedexPackagningTypeId?: number,
    trackingNumber?: string
  ) {
    this.clinicId = clinicId;
    this.packageType = packageType;
    this.products = products;
    this.containerTypeId = containerTypeId;
    this.fedexPackagingTypeId = fedexPackagningTypeId;
    this.trackingNumber = trackingNumber;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }
}
