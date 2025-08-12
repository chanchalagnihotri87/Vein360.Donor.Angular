import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Clinic from '../../donation/shared/clinic.model';
import DonationProduct from '../../donation/shared/donation-product.model';
import Donation from '../../donation/shared/donation.model';
import { DonationService } from '../../donation/shared/donation.service';
import { LabelService } from '../../donation/shared/label.service';
import { ProductCategoryService } from '../../donation/shared/product-category.service';
import Product from '../../donation/shared/product.model';
import { UserInfoService } from '../../login/shared/user-info.service';
import { BaseComponent } from '../../shared/base-component';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';

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
      this.returnForm.patchValue({
        clinicId: this.donation!.clinic!.id.toString(),
        quantity: this.donation!.donationProduct?.units,
      });
    } else {
      if (this.defaultClinicId) {
        this.loadTrackingNumbers(this.defaultClinicId);
        this.returnForm.patchValue({
          clinicId: this.defaultClinicId!.toString(),
        });
      }
    }
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

  submitReturnForm() {
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

  get defaultClinicId() {
    if (this.userInfo.defaultClinicId()) {
      return this.userInfo.defaultClinicId();
    }

    if (this.clinics.length > 0) {
      return this.clinics[0].id;
    }

    return undefined;
  }

  get trackingNumberFormControl() {
    return this.returnForm.get('trackingNumber') as FormControl;
  }

  private updateTrackingNumberValidations() {
    if (this.useOldLabel) {
      this.trackingNumberFormControl.setValidators([Validators.required]);
    } else {
      this.trackingNumberFormControl.clearValidators();
    }
    this.trackingNumberFormControl.updateValueAndValidity();
  }

  protected getCategoryDescription(category?: number) {
    return this.productCategoryService.getCategoryString(category);
  }
}
