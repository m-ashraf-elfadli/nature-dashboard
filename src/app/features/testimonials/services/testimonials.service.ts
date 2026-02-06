import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PaginationObj } from '../../../core/models/global.interface';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private apiService = inject(ApiService);
  private api = inject(ApiService);
  private endpoint = 'testimonials';
  getAll(pagination: PaginationObj, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());

    if (search) {
      params = params.set('key', search);
    }

    return this.api.get('testimonials', params);
  }

  getById(id: string): Observable<any> {
    return this.api.get(`testimonials/${id}`);
  }

  create(payload: any): Observable<any> {
    const body = {
      client_name_en: payload.clientNameEn,
      client_name_ar: payload.clientNameAr,
      job_title_en: payload.jobTitleEn,
      job_title_ar: payload.jobTitleAr,
      testimonial_en: payload.testimonialEn,
      testimonial_ar: payload.testimonialAr
    };

    return this.api.post('testimonials', body);
  }

  update(id: string, payload: any): Observable<any> {
    const body = {
      client_name_en: payload.clientNameEn,
      client_name_ar: payload.clientNameAr,
      job_title_en: payload.jobTitleEn,
      job_title_ar: payload.jobTitleAr,
      testimonial_en: payload.testimonialEn,
      testimonial_ar: payload.testimonialAr
    };

    return this.api.post(`testimonials/${id}`, body);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`testimonials/${id}`);
  }

  bulkDelete(ids: string[]): Observable<any> {
    const payload = { ids };
    return this.api.post('testimonials/actions/bulk-delete', payload);
  }

  changeStatus(id: string, value: boolean) {
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData: FormData = new FormData();
    formData.append('status', value ? '1' : '0');
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}