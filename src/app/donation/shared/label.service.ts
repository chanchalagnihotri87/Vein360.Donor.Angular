import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private readonly baseUrl = `${environment.apiUrl}/label`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getLabel(labelFileName: string) {
    return this.httpClient.get(`${this.baseUrl}/${labelFileName}`, {
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
