import ListItem from '../../../donor/donation/shared/list-tem.model';
import Product from '../../../donor/donation/shared/product.model';
import { OrderStatus } from './order-status';

export class Order {
  public expanded: boolean = false;
  constructor(
    public id: number,
    public product: Product,
    public clinic: ListItem,
    public price: number,
    public paid: boolean,
    public status: OrderStatus,
    public createdDate: Date = new Date()
  ) {}
}
