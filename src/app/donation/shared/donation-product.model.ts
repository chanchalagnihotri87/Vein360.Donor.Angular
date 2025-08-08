import Product from './product.model';

export default class DonationProduct {
  public id?: number;
  public rejectedClogged?: number;
  public rejectedDamaged?: number;
  public rejectedFunction?: number;
  public rejectedKinked?: number;
  public rejectedOther?: number;

  public product?: Product;

  constructor(
    public productId: number,
    public units: number,
    public accepted?: number,
    public rejected?: number
  ) {}
}
