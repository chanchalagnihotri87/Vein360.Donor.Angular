import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/documents`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getLabel(labelFileName: string) {
    return this.httpClient.get(`${this.baseUrl}/label/${labelFileName}`, {
      responseType: 'blob',
    });
  }

  downloadLabel(labelData: Blob, labelFileName: string) {
    let blob = new Blob([labelData], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `label_${labelFileName}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
