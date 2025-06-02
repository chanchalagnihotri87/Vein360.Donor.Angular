import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import ConversionHelper from '../../../common/conversion-helpter';
import ContainerType from '../../container/shared/container-type.model';
import DonationContainer from '../../container/shared/donation-container.model';
import { DonationContainerService } from '../../container/shared/donation-container.service';
import { PackageType } from '../../shared/enums/package-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import DonationProduct from '../shared/donation-product.model';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
import { LabelService } from '../shared/label.service';
import ListItem from '../shared/list-tem.model';
import Product from '../shared/product.model';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, FormsModule, ValidationMessageComponent],
  templateUrl: './add-donation.component.html',
})
export class AddDonationComponent implements OnInit {
  @Input({ required: true }) products: Product[] = [];
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) clinics: ListItem[] = [];
  @Input({ required: true }) defaultClinicId: number = 0;

  public onSubmit = output<Donation>();
  public onClose = output();

  public containers: DonationContainer[] = [];
  public trackingNumbers: string[] = [];
  public useOldLabel: boolean = false;
  public selectedPackageType: string;
  public donationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fedexPackService: FedexService,
    private dontainerContainerService: DonationContainerService,
    private labelService: LabelService
  ) {
    this.donationForm = this.createDonationForm();
    this.selectedPackageType = PackageType.CustomPackage.toString();
  }

  ngOnInit(): void {
    this.setDefaultValuesInFormControls();
    this.subscribeToPackageTypeChange();
    this.loadDonationContainers();
    this.loadDefaultValuesInForm();
    this.loadTrackingNumbers(this.defaultClinicId);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      const newDonation = new Donation(
        this.donationForm.value.clinicId,
        this.donationForm.value.packageType,
        this.donationForm.value.products.map(
          (productItem: { product: number; units: number }) => {
            return new DonationProduct(productItem.product, productItem.units);
          }
        ),
        this.donationForm.value.containerTypeId == ''
          ? undefined
          : this.donationForm.value.containerTypeId,
        this.donationForm.value.fedexPackageTypeId == ''
          ? undefined
          : this.donationForm.value.fedexPackageTypeId,
        this.donationForm.value.trackingNumber == ''
          ? undefined
          : this.donationForm.value.trackingNumber
      );

      this.onSubmit.emit(newDonation);
      this.onClose.emit();
    }
  }

  public addProduct() {
    this.productFormControls.push(
      this.formBuilder.group({
        product: ['', Validators.required],
        units: ['', Validators.required],
      })
    );
  }

  public packageTypeChanged() {
    this.containerTypeIdFormControl.setValue('');
    this.fedexPackageTypeIdFormControl.setValue('');
  }

  public clinicSelectionChanged(event: Event) {
    let clinicId = ConversionHelper.convertToInt(
      (event.currentTarget as HTMLSelectElement).value
    );

    this.loadTrackingNumbers(clinicId);
    this.trackingNumberFormControl.setValue('');
  }

  public closeModal() {
    this.onClose.emit();
  }

  public useOldLabelSelectionChanged() {
    this.useOldLabel = !this.useOldLabel;

    this.updateTrackingNumberValidations();
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return PackageType;
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get containerTypeIdFormControl() {
    return this.donationForm.get('containerTypeId') as FormControl;
  }

  get fedexPackageTypeIdFormControl() {
    return this.donationForm.get('fedexPackageTypeId') as FormControl;
  }

  get trackingNumberFormControl() {
    return this.donationForm.get('trackingNumber') as FormControl;
  }

  get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      clinicId: ['', Validators.required],
      packageType: ['', Validators.required],
      containerTypeId: [''],
      fedexPackageTypeId: [''],
      trackingNumber: [''],

      products: this.formBuilder.array([
        this.formBuilder.group({
          product: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
          units: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
        }),
      ]),
    });
  }

  private setDefaultValuesInFormControls() {
    (this.donationForm.get('products') as FormArray).controls[0]
      .get('product')
      ?.setValue(''); // Set "Select Product" as default value for the first product control

    (this.donationForm.get('products') as FormArray).controls[0]
      .get('units')
      ?.setValue('');
  }

  private subscribeToPackageTypeChange() {
    this.donationForm.get('packageType')?.valueChanges.subscribe((val) => {
      this.updateContainerAndFedexPackagingValidations(val);
    });
  }

  private updateContainerAndFedexPackagingValidations(packageType: string) {
    switch (packageType) {
      case PackageType.Vein360Container.toString():
        this.containerTypeIdFormControl.setValidators([Validators.required]);
        this.fedexPackageTypeIdFormControl.clearValidators();
        break;

      case PackageType.FedexPackage.toString():
        this.fedexPackageTypeIdFormControl.setValidators([Validators.required]);
        this.containerTypeIdFormControl.clearValidators();
        break;
      default:
        this.containerTypeIdFormControl.clearValidators();
        this.fedexPackageTypeIdFormControl.clearValidators();
        break;
    }

    this.containerTypeIdFormControl.updateValueAndValidity();
    this.fedexPackageTypeIdFormControl.updateValueAndValidity();
  }

  private updateTrackingNumberValidations() {
    if (this.useOldLabel) {
      this.trackingNumberFormControl.setValidators([Validators.required]);
    } else {
      this.trackingNumberFormControl.clearValidators();
    }

    this.trackingNumberFormControl.updateValueAndValidity();
  }

  private loadDonationContainers() {
    this.dontainerContainerService
      .getAvalableContainers()
      .subscribe((containers) => {
        this.containers = containers;
      });
  }

  private loadTrackingNumbers(clinicId: number) {
    if (clinicId) {
      this.labelService.getLabels(clinicId).subscribe((labels) => {
        this.trackingNumbers = labels;
      });

      return;
    }

    this.trackingNumbers = [];
  }

  private loadDefaultValuesInForm() {
    this.donationForm.patchValue({
      clinicId: this.defaultClinicId,
    });
  }
  //#endregion
}
