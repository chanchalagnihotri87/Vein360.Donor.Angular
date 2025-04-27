import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import Product from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private httpClient: HttpClient) {}

  // private products: Product[] = [
  //   new Product(1, 'Vein360 Reprocessed ClosureFast Catheter (VEN-7-60B)', ''),
  //   new Product(
  //     2,
  //     'Vein360 Complete Procedure Pack - 7F x 7 cm Introducer Kit',
  //     ''
  //   ),
  //   new Product(3, 'Vein360 7F x 7 cm Introducer Sheath Kit', ''),
  //   new Product(4, 'Vein360 Basic Procedure Pack', ''),
  //   new Product(5, 'Vein360 Reprocessed ClosureFast Catheter (VEN-7-80B)', ''),
  //   new Product(6, 'Vein360 Reprocessed ClosureFast Catheter (VEN-7-100B)', ''),
  // ];

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }
}
