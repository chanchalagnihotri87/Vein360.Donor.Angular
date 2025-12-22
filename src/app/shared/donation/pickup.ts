export default class Pickup {
  constructor(
    public pickupTransactionId: string,
    public pickupConfirmationCode: string,
    public pickupDateTime: Date
  ) {}
}
