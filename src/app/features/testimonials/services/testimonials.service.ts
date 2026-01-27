import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

  private api = inject(ApiService);

  getAll(page = 1, size = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

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
}