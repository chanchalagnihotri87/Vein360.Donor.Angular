import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from '../../login/shared/user-info.service';
import { BaseComponent } from '../../shared/base-component';
import Clinic from '../../shared/clinic/clinic.model';
import DonationProduct from '../../shared/donation/donation-product.model';
import { DonationService } from '../../shared/donation/donation.service';
import { LabelService } from '../../shared/label/label.service';
import { ProductCategoryService } from '../../shared/product/product-category.service';
import Product from '../../shared/product/product.model';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import Donation from '../shared/donation.model';

@Component({
  selector: 'app-return-control',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './return-control.component.html',
  styleUrl: './return-control.component.scss',
})
export class ReturnControlComponent extends BaseComponent implements OnInit {
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) product?: Product;
  @Input({ required: true }) clinics: Clinic[] = [];
  @Input() donation?: Donation;

  public onClose = output();
  public onSubmit = output<Donation>();

  protected useOldLabel: boolean = false;
  protected returnForm: FormGroup;
  protected trackingNumbers: string[] = [];

  protected get defaultClinicId() {
    if (this.userInfo.defaultClinicId()) {
      return this.userInfo.defaultClinicId();
    }

    if (this.clinics.length > 0) {
      return this.clinics[0].id;
    }

    return undefined;
  }
  protected get trackingNumberFormControl() {
    return this.returnForm.get('trackingNumber') as FormControl;
  }

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly userInfo: UserInfoService,
    private readonly labelService: LabelService,
    private readonly donationService: DonationService,
    private readonly productCategoryService: ProductCategoryService
  ) {
    super();
    this.returnForm = this.createReturnForm();
  }

  ngOnInit(): void {
    if (this.donation) {
      this.loadTrackingNumbers(this.donation!.clinic!.id);
      this.fillForm(this.donation);
      return;
    }

    if (this.defaultClinicId) {
      this.loadTrackingNumbers(this.defaultClinicId);
      this.fillFormWithDefaultValues();
    }
  }

  //#region  Public Methods

  protected closeModal() {
    this.onClose.emit();
  }

  protected clinicChanged(event: Event) {
    let clinicId = parseInt((event.currentTarget as HTMLSelectElement).value);
    this.clearTrackingNumberSelect();
    this.loadTrackingNumbers(clinicId);
  }

  protected toggleUseOldLabel(): void {
    this.useOldLabel = !this.useOldLabel;
    this.updateTrackingNumberValidations();
  }

  protected submitReturnForm() {
    if (!this.returnForm.valid) {
      return;
    }

    let donation = new Donation(
      this.returnForm.value.clinicId,
      [new DonationProduct(this.product!.id, this.returnForm.value.quantity)],
      this.returnForm.value.trackingNumber == ''
        ? undefined
        : this.returnForm.value.trackingNumber
    );

    this.onSubmit.emit(donation);
  }

  protected getCategoryDescription(category?: number) {
    return this.productCategoryService.getCategoryString(category);
  }

  //#endregion

  //#region Private Methods
  private fillForm(donation: Donation) {
    this.returnForm.patchValue({
      clinicId: this.donation!.clinic!.id.toString(),
      quantity: this.donation!.donationProduct?.units,
    });
  }
  private fillFormWithDefaultValues() {
    this.returnForm.patchValue({
      clinicId: this.defaultClinicId!.toString(),
    });
  }

  private updateTrackingNumberValidations() {
    if (this.useOldLabel) {
      this.trackingNumberFormControl.setValidators([Validators.required]);
    } else {
      this.trackingNumberFormControl.clearValidators();
    }
    this.trackingNumberFormControl.updateValueAndValidity();
  }

  private createReturnForm() {
    return this.formBuilder.group({
      clinicId: ['', Validators.required],
      quantity: new FormControl(1, [Validators.required]),
      trackingNumber: [''],
    });
  }

  private clearTrackingNumberSelect() {
    this.returnForm.patchValue({
      trackingNumber: '',
    });
  }

  private loadTrackingNumbers(clinicId: number) {
    this.labelService.getLabels(clinicId).subscribe((trackingNumbers) => {
      this.trackingNumbers = trackingNumbers;
    });
  }

  //#endregion
}
