import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import Clinic from '../donation/shared/clinic.model';
import { ClinicService } from '../donation/shared/clinic.service';
import Donation from '../donation/shared/donation.model';
import { DonationService } from '../donation/shared/donation.service';
import { ReturnControlComponent } from '../return/return-control/return-control.component';
import { BaseComponent } from '../shared/base-component';
import { BreadcrumbItem } from '../shared/breadcrumb/shared/breadcrumb-item.model';
import { ProductType } from '../shared/enums/product-type.enum';
import { UserProduct } from './shared/user-product.model';
import { UserProductService } from './shared/user-product.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent extends BaseComponent implements OnInit {
  protected searchText = '';
  protected products: UserProduct[] = [];
  protected allProducts: UserProduct[] = [];
  protected clinics: Clinic[] = [];
  protected productLoaded = false;
  private selectedCategories: number[] = [];
  private returnNowModal?: BsModalRef;

  constructor(
    private readonly router: Router,
    private readonly clinicServie: ClinicService,
    private readonly modalService: BsModalService,
    private readonly donationService: DonationService,
    private readonly userProductService: UserProductService
  ) {
    super();

    this.setBereadcrumb([new BreadcrumbItem('Home', '')]);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadClinics();
  }

  private loadProducts() {
    this.userProductService.getSortProducts().subscribe((products) => {
      this.products = products;
      this.allProducts = products;
      this.productLoaded = true;
    });
  }

  private loadClinics() {
    this.clinicServie.getMyClinics().subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  protected get ProductType() {
    return ProductType;
  }

  protected get apiDomainUrl() {
    return environment.apiUrl;
  }

  protected onChangeSearch() {
    this.filterProducts();
  }

  protected categoryIsSelected(category: ProductType) {
    return this.selectedCategories.indexOf(category) > -1;
  }

  protected getCategoryProductCount(category: ProductType) {
    return this.allProducts.filter((x) => x.type == category).length;
  }

  protected toggleCategorySelection(category: ProductType) {
    if (this.selectedCategories.indexOf(category) > -1) {
      this.selectedCategories.splice(
        this.selectedCategories.indexOf(category),
        1
      );
    } else {
      this.selectedCategories.push(category);
    }

    this.filterProducts();
  }

  private filterProducts() {
    let filteredProducts = this.allProducts;

    if (this.searchText.length > 0) {
      let searchWords = this.searchText.trim().split(' ');

      filteredProducts = this.allProducts
        .map((x) => {
          let searchMatchRank: number = 0;
          searchWords.forEach((searchWord) => {
            if (x.name.toLowerCase().indexOf(searchWord.toLowerCase()) != -1) {
              searchMatchRank++;
            }
          });
          return { ...x, searchRank: searchMatchRank };
        })
        .filter((x) => x.searchRank > 0);
    }

    if (this.selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(
        (p) => this.selectedCategories.indexOf(p.type) > -1
      );
    }

    this.products = filteredProducts.sort((a, b) =>
      a.searchRank > b.searchRank ? -1 : 1
    );
  }

  protected returnNow(productId: number) {
    this.userProductService.getProduct(productId).subscribe((product) => {
      this.showReturnNowModal(product);
    });
  }

  private showReturnNowModal(product: UserProduct) {
    this.returnNowModal = this.modalService.show(ReturnControlComponent, {
      initialState: {
        title: 'Confirmation',
        product: product,
        clinics: this.clinics,
      },
      backdrop: 'static',
    });

    this.returnNowModal.content.onClose.subscribe(() => {
      this.closeReturnNowModal();
    });

    this.returnNowModal.content.onSubmit.subscribe((donation: Donation) => {
      this.donationService.addDonation(donation).subscribe(() => {
        this.closeReturnNowModal();
        this.router.navigate(['return']);
      });
    });
  }

  private closeReturnNowModal() {
    this.returnNowModal?.hide();
  }
}
