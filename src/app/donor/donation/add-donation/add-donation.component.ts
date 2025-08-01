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

import ConversionHelper from '../../../../common/conversion-helpter';
import { PackageType } from '../../../shared/enums/package-type.enum';
import { UserInfoService } from '../../../shared/login/shared/user-info.service';
import { ValidationMessageComponent } from '../../../shared/validation-message/validation-message.component';
import ContainerType from '../../container/shared/container-type.model';
import DonationContainer from '../../container/shared/donation-container.model';
import { DonationContainerService } from '../../container/shared/donation-container.service';
import DonationProduct from '../shared/donation-product.model';
import Donation from '../shared/donation.model';
import { LabelService } from '../shared/label.service';
import ListItem from '../shared/list-tem.model';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, FormsModule, ValidationMessageComponent],
  templateUrl: './add-donation.component.html',
})
export class AddDonationComponent implements OnInit {
  @Input({ required: true }) products: ListItem[] = [];
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) clinics: ListItem[] = [];
  //@Input() defaultClinicId?: number;

  public onSubmit = output<Donation>();
  public onClose = output();

  public containers: DonationContainer[] = [];
  public trackingNumbers: string[] = [];
  public useOldLabel: boolean = false;
  public selectedPackageType: string;
  public donationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dontainerContainerService: DonationContainerService,
    private labelService: LabelService,
    private userInfo: UserInfoService
  ) {
    this.donationForm = this.createDonationForm();
    this.selectedPackageType = PackageType.CustomPackage.toString();
  }

  ngOnInit(): void {
    this.setDefaultValuesInFormControls();
    this.loadDonationContainers();

    this.loadDefaultValuesInForm();
    this.loadTrackingNumbers(this.defaultClinicId);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      const newDonation = new Donation(
        this.donationForm.value.clinicId,
        this.donationForm.value.products.map(
          (productItem: { product: number; units: number }) => {
            return new DonationProduct(productItem.product, productItem.units);
          }
        ),
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

  get trackingNumberFormControl() {
    return this.donationForm.get('trackingNumber') as FormControl;
  }

  get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  get defaultClinicId() {
    if (this.userInfo.defaultClinicId()) {
      return this.userInfo.defaultClinicId();
    }

    if (this.clinics.length > 0) {
      return this.clinics[0].id;
    }

    return undefined;
  }
  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      clinicId: ['', Validators.required],
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

  private loadTrackingNumbers(clinicId?: number) {
    if (clinicId) {
      this.labelService.getLabels(clinicId).subscribe((labels) => {
        this.trackingNumbers = labels;
      });

      return;
    }

    this.trackingNumbers = [];
  }

  private loadDefaultValuesInForm() {
    console.log('Default clinic id:' + this.defaultClinicId);
    if (this.defaultClinicId) {
      this.donationForm.patchValue({
        clinicId: this.defaultClinicId,
      });
    }
  }
  //#endregion
}
