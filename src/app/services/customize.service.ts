import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomizeService {
  constructor() {}
  private apiService = inject(ApiService);
  private endpoint = 'sections';
  private lang = this.apiService.getCulture();

  getSection(lang: string = this.lang): Observable<any> {
    this.apiService.setCulture(lang);
    return this.apiService.get(`${this.endpoint}/show`);
  }
  updateSection(body: any, lang: string = this.lang) {
    this.apiService.setCulture(lang);
    return this.apiService.post(`${this.endpoint}/update`, body);
  }
}
