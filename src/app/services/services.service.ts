import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
import {
  PaginationObj,
  PaginationResponse,
} from '../core/models/global.interface';
import { HttpParams } from '@angular/common/http';
import { Service } from '../pages/services/services.component';

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
  getAll(
    pagination: PaginationObj,
    search: string = '',
  ): Observable<PaginationResponse<Service>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('size', pagination.size);
    if (search) {
      params = params.set('value', search);
    }
    return this.apiService.get(this.endpoint, params);
  }
  getServiceById(id: string, lang: string = this.lang): Observable<any> {
    this.apiService.setCulture(lang);
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }
  updateService(id: string, body: any, lang: string = this.lang) {
    this.apiService.setCulture(lang);
    return this.apiService.post(`${this.endpoint}/${id}`, body);
  }
  delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
    bulkDelete(ids:string[]):Observable<any>{
    let payload = {
      ids
    }
    return this.apiService.post(`${this.endpoint}/actions/bulk-delete`,payload)
  }
  changeStatus(id: string, value: boolean) {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData: FormData = new FormData();
    formData.append('status', value ? '1' : '0');
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}
