import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { UserProduct } from './user-product.model';

@Injectable({
  providedIn: 'root',
})
export class UserProductService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getSortProducts() {
    return this.httpClient.get<UserProduct[]>(
      `${this.baseUrl}/user/products/sort`
    );
  }

  getProduct(productId: number) {
    return this.httpClient.get<UserProduct>(
      `${this.baseUrl}/user/product/${productId}`
    );
  }
}
