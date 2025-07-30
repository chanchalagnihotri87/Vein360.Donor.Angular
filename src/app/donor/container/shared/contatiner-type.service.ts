import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import ContainerType from './container-type.model';

@Injectable({
  providedIn: 'root',
})
export class ContatinerTypeService {
  private readonly baseUrl = `${environment.apiUrl}/containertypes`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getContainerTypes() {
    return this.httpClient.get<ContainerType[]>(this.baseUrl);
  }
}
