import ContainerType from '../../container/shared/container-type.model';
import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import Clinic from './clinic.model';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  clinicId: number;
  productTypes: string[] = [];
  trackingNumber?: string;
  useOldLabel: boolean = false;
  labelFileName: string = '';
  labelPath?: string;
  createdDate: Date = new Date();
  status: DonationStatus = DonationStatus.Returned;

  products: DonationProduct[];
  containerType?: ContainerType; // This will be set later when the container is fetched

  donationProduct?: DonationProduct; //for request with single product changes

  clinic?: Clinic;

  public expanded: boolean = false;

  constructor(
    clinicId: number,
    products: DonationProduct[],
    trackingNumber?: string
  ) {
    this.clinicId = clinicId;
    this.products = products;
    this.trackingNumber = trackingNumber;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }
}
