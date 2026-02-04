import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
import {
  GetByIdResponse,
  PaginationObj,
  PaginationResponse,
} from '../core/models/global.interface';
import { Award } from '../features/awards/models/awards.interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AwardsService {
  constructor() {}
  private apiService = inject(ApiService);
  private endpoint = 'awards';
  private lang = this.apiService.getCulture();

  getAllAwards(): Observable<any> {
    return this.apiService.get(this.endpoint);
  }

  getAll(
    pagination: PaginationObj,
    search: string = '',
  ): Observable<PaginationResponse<Award>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('size', pagination.size);
    if (search) {
      params = params.set('value', search);
    }
    return this.apiService.get(this.endpoint, params);
  }

  create(
    body: any,
    culture = localStorage.getItem('app_lang'),
  ): Observable<any> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.post(this.endpoint, body);
  }

  update(
    id: string,
    body: any,
    culture = localStorage.getItem('app_lang'),
  ): Observable<any> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.post(`${this.endpoint}/${id}`, body);
  }

  getById(id: string, culture: string): Observable<GetByIdResponse<Award>> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
  changeStatus(id: string, value: boolean) {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData: FormData = new FormData();
    formData.append('status', value ? '1' : '0');
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}
