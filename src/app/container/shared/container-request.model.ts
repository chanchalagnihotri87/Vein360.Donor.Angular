export default class ContainerRequest {
  constructor(
    public containerTypeId: number,
    public units: number,
    public clinicId: number
  ) {}
}
