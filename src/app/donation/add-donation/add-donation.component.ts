import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import ContainerListItem from '../../container/shared/container-list-item-model';
import DonationContainer from '../../container/shared/donation-container.model';
import { DonationContainerService } from '../../container/shared/donation-container.service';
import { ContainerType } from '../../shared/enums/container-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import DonationProduct from '../shared/donation-product.model';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
import Product from '../shared/product.model';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './add-donation.component.html',
  styleUrl: './add-donation.component.scss',
})
export class AddDonationComponent implements OnInit {
  @Input({ required: true }) products: Product[] = [];

  public onSubmit = output<Donation>();
  public onClose = output();

  public containers: DonationContainer[] = [];
  public length?: number;
  public width?: number;
  public height?: number;
  public selectedContainerType: string;
  public donationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fedexPackService: FedexService,
    private dontainerContainerService: DonationContainerService
  ) {
    this.donationForm = this.createDonationForm();
    this.selectedContainerType = ContainerType.OwnCustomPacking.toString();
  }

  ngOnInit(): void {
    this.setDefaultValuesInFormControls();
    this.subscribeToContainerTypeChange();
    this.loadDonationContainers();
  }

  //#region  Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      const newDonation = new Donation(
        this.donationForm.value.containerType,
        this.donationForm.value.container != ''
          ? this.donationForm.value.container
          : null,
        this.donationForm.value.products.map(
          (productItem: { product: number; units: number }) => {
            return new DonationProduct(productItem.product, productItem.units);
          }
        ),
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.length
          : undefined,
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.width
          : undefined,
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.height
          : undefined
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

  public containerTypeChanged() {
    (this.donationForm.get('container') as FormControl)?.setValue(''); // Set
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return ContainerType;
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get associatedContainers(): ContainerListItem[] {
    if (this.selectedContainerType === '') {
      return [];
    }

    if (
      this.selectedContainerType === ContainerType.FedexContainer.toString()
    ) {
      return this.fedexPacks.map(
        (pack) => new ContainerListItem(pack.id, pack.description)
      );
    }

    return this.containers.map(
      (item) =>
        new ContainerListItem(
          item.id,
          `#${item.id} ${item.containerType?.name} ${
            item.container?.containerCode
              ? `[${item.container?.containerCode}]`
              : ''
          }`
        )
    );
  }

  get containerTypeFormControl() {
    return this.donationForm.get('containerType') as FormControl;
  }

  get containerFormControl() {
    return this.donationForm.get('container') as FormControl;
  }

  get lengthFormControl() {
    return this.donationForm.get('length') as FormControl;
  }

  get widhtFormControl() {
    return this.donationForm.get('width') as FormControl;
  }

  get heightFormControl() {
    return this.donationForm.get('height') as FormControl;
  }

  get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      containerType: ['', Validators.required],
      container: ['', Validators.required],
      // weight: ['', Validators.required],
      weight: [''],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],

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

  private subscribeToContainerTypeChange() {
    this.donationForm.get('containerType')?.valueChanges.subscribe((val) => {
      this.updateContainerValidations(val);
      this.updateDimentionValidations(val);
    });
  }

  private updateContainerValidations(containerType: string) {
    if (containerType == ContainerType.OwnCustomPacking.toString()) {
      this.containerFormControl.clearValidators();
    } else {
      this.containerFormControl.setValidators([Validators.required]);
    }

    this.containerFormControl.updateValueAndValidity();
  }

  private updateDimentionValidations(containerType: string) {
    if (containerType == ContainerType.OwnCustomPacking.toString()) {
      this.lengthFormControl.setValidators([Validators.required]);
      this.widhtFormControl.setValidators([Validators.required]);
      this.heightFormControl.setValidators([Validators.required]);
    } else {
      this.lengthFormControl.clearValidators();
      this.widhtFormControl.clearValidators();
      this.heightFormControl.clearValidators();
    }

    this.lengthFormControl.updateValueAndValidity();
    this.widhtFormControl.updateValueAndValidity();
    this.heightFormControl.updateValueAndValidity();
  }

  private loadDonationContainers() {
    this.dontainerContainerService
      .getAvalableContainers()
      .subscribe((containers) => {
        this.containers = containers;
      });
  }
  //#endregion
}
