import { Injectable } from '@angular/core';
import { FedexPack } from './fedex.pack.model';

@Injectable({
  providedIn: 'root',
})
export default class FedexService {
  private fedexPacks: FedexPack[] = [
    //Not showing first three because we are extra option for Own Custom Package
    // new FedexPack(
    //   1,
    //   'YOUR_PACKAGING',
    //   'Customer Packaging, FedEx Express® Services',
    // 38
    // ),
    // new FedexPack(
    //   2,
    //   'YOUR_PACKAGING',
    //   'FedEx Ground® and FedEx Home Delivery®',
    //   32
    // ),
    // new FedexPack(
    //   3,
    //   'YOUR_PACKAGING',
    //   'Customer Packaging, FedEx Ground® Economy (Formerly known as FedEx SmartPost®) Services',
    // 32
    // ),
    new FedexPack(4, 'FEDEX_ENVELOPE', 'FedEx® Envelope', 0.5),
    new FedexPack(5, 'FEDEX_BOX', 'FedEx® Box', 9),
    new FedexPack(6, 'FEDEX_SMALL_BOX', 'FedEx® Small Box', 9),
    new FedexPack(7, 'FEDEX_MEDIUM_BOX', 'FedEx® Medium Box', 9),
    new FedexPack(8, 'FEDEX_LARGE_BOX', 'FedEx® Large Box', 9),
    new FedexPack(9, 'FEDEX_EXTRA_LARGE_BOX', 'FedEx® Extra Large Box', 9),
    new FedexPack(10, 'FEDEX_10KG_BOX', 'FedEx® 10kg Box', 10),
    new FedexPack(11, 'FEDEX_25KG_BOX', 'FedEx® 25kg Box', 25),
    new FedexPack(12, 'FEDEX_PAK', 'FedEx® Pak', 9),
    new FedexPack(13, 'FEDEX_TUBE', 'FedEx® Tube', 9),
  ];

  public get FedexPacks(): FedexPack[] {
    return [...this.fedexPacks];
  }
}
