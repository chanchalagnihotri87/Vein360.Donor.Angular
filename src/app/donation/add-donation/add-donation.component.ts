import { Component, inject, Input, OnInit, output } from '@angular/core';
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
  private formBuilder = inject(FormBuilder);

  selectedContainerType: string = '';

  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  public onSubmit = output<Donation>();
  public onClose = output();

  constructor(private fedexPackService: FedexService) {}

  ngOnInit(): void {
    (this.donationForm.get('products') as FormArray).controls[0]
      .get('product')
      ?.setValue(''); // Set "Select Product" as default value for the first product control

    (this.donationForm.get('products') as FormArray).controls[0]
      .get('units')
      ?.setValue(''); // Set empty value as default value for the first units control
  }

  closeModal() {
    this.onClose.emit();
  }

  submitForm() {
    if (this.donationForm.valid) {
      const newDonation = new Donation(
        this.donationForm.value.containerType,
        this.donationForm.value.container,
        this.donationForm.value.weight,
        this.donationForm.value.products.map(
          (productItem: { product: number; units: number }) => {
            return new DonationProduct(productItem.product, productItem.units);
          }
        )
      );

      debugger;
      this.onSubmit.emit(newDonation);
      this.onClose.emit();
    }
  }

  donationForm: FormGroup = this.formBuilder.group({
    containerType: ['', Validators.required],
    container: ['', Validators.required],
    weight: ['', Validators.required],
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

  addProduct() {
    this.productControls.push(
      this.formBuilder.group({
        product: ['', Validators.required],
        units: ['', Validators.required],
      })
    );
  }

  get containerType() {
    return this.donationForm.get('containerType') as FormControl;
  }

  get container() {
    return this.donationForm.get('container') as FormControl;
  }

  get weight() {
    return this.donationForm.get('weight') as FormControl;
  }

  get productControls() {
    return this.donationForm.get('products') as FormArray;
  }

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
}
