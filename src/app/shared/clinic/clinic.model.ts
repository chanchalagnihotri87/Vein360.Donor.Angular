export default class Clinic {
  public isDefault: boolean = false;
  public userId?: number;
  constructor(
    public id: number,
    public clinicName: string,
    public contactName: string,
    public contactEmail: string,
    public contactPhone: string,
    public addressLine1: string,
    public addressLine2: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string
  ) {}
}
