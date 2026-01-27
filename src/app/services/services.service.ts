import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor() {}
  private apiService = inject(ApiService);
  private endpoint = 'services';
  private lang = this.apiService.getCulture();

  createService(body: any, lang: string = this.lang) {
    this.apiService.setCulture(lang);
    return this.apiService.post(this.endpoint, body);
  }
  getAllServices() {
    return this.apiService.get(this.endpoint);
  }
  getServiceById(id: string, lang: string = this.lang) {
    this.apiService.setCulture(lang);
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }
  updateService(id: string, body: any, lang: string = this.lang) {
    this.apiService.setCulture(lang);
    return this.apiService.post(`${this.endpoint}/${id}`, body);
  }
}
