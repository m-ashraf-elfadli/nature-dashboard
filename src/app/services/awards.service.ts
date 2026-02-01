import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
import { GetByIdResponse } from '../core/models/global.interface';

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

  getById(
    id: string,
    culture: string,
  ): Observable<GetByIdResponse<any>> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }
}
