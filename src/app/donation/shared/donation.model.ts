import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import DonationContainer from './donation-container.model';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  containerType: number;
  containerId: number;
  weight?: number;
  productTypes: string[] = [];
  trackingNumber: string = '';
  labelFileName: string = '';
  labelPath?: string;
  createdDate: Date = new Date();
  status: DonationStatus = DonationStatus.Pending;

  products: DonationProduct[];
  container: DonationContainer | undefined; // This will be set later when the container is fetched

  constructor(
    containerType: number,
    containerId: number,
    weight: number,
    products: DonationProduct[]
  ) {
    this.containerId = containerId;
    this.containerType = containerType;
    this.weight = weight;
    this.products = products;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }

  // get dateObject(): Date {
  //   return ConversionHelper.convertStringToDate(this.createdDate);
  // }
}
