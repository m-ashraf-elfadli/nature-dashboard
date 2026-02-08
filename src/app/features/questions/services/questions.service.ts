import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PaginationObj } from '../../../core/models/global.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private apiService = inject(ApiService);
  private endpoint = 'questions';

  getAll(pagination: PaginationObj, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());

    if (search) {
      params = params.set('value', search);
    }

    return this.apiService.get(this.endpoint, params);
  }

  getById(id: string): Observable<any> {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }

  create(payload: any): Observable<any> {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.apiService.post(this.endpoint, payload);
  }

  update(id: string, payload: any): Observable<any> {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.apiService.post(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  changeStatus(id: string, value: boolean): Observable<any> {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData: FormData = new FormData();
    formData.append('status', value ? '1' : '0');
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}
