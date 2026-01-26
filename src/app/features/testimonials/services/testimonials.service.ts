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

  create(payload: any): Observable<any> {
    return this.api.post('testimonials', payload);
  }

  update(id: string, payload: any): Observable<any> {
    return this.api.put(`testimonials/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`testimonials/${id}`);
  }
}
