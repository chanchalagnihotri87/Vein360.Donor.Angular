export default class DonationProduct {
  public id?: number;
  constructor(
    public productId: number,
    public units: number,
    public accepted?: number,
    public rejected?: number
  ) {}
}
