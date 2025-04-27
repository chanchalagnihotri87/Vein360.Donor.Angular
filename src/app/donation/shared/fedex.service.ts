import { Injectable } from '@angular/core';
import { FedexPack } from './fedex.pack.model';

@Injectable({
  providedIn: 'root',
})
export default class FedexService {
  private fedexPacks: FedexPack[] = [
    new FedexPack(
      1,
      'YOUR_PACKAGING',
      'Customer Packaging, FedEx Express® Services'
    ),
    new FedexPack(
      2,
      'YOUR_PACKAGING',
      'FedEx Ground® and FedEx Home Delivery®'
    ),
    new FedexPack(
      3,
      'YOUR_PACKAGING',
      'Customer Packaging, FedEx Ground® Economy (Formerly known as FedEx SmartPost®) Services'
    ),
    new FedexPack(4, 'FEDEX_ENVELOPE', 'FedEx® Envelope'),
    new FedexPack(5, 'FEDEX_BOX', 'FedEx® Box'),
    new FedexPack(6, 'FEDEX_SMALL_BOX', 'FedEx® Small Box'),
    new FedexPack(7, 'FEDEX_MEDIUM_BOX', 'FedEx® Medium Box'),
    new FedexPack(8, 'FEDEX_LARGE_BOX', 'FedEx® Large Box'),
    new FedexPack(9, 'FEDEX_EXTRA_LARGE_BOX', 'FedEx® Extra Large Box'),
    new FedexPack(10, 'FEDEX_10KG_BOX', 'FedEx® 10kg Box'),
    new FedexPack(11, 'FEDEX_25KG_BOX', 'FedEx® 25kg Box'),
    new FedexPack(12, 'FEDEX_PAK', 'FedEx® Pak'),
    new FedexPack(13, 'FEDEX_TUBE', 'FedEx® Tube'),
  ];

  public get FedexPacks(): FedexPack[] {
    return [...this.fedexPacks];
  }
}
