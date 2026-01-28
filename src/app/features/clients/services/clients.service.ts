import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PaginationObj } from '../../../core/models/global.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private api = inject(ApiService);

  getAll(pagination: PaginationObj, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());

    if (search) {
      params = params.set('key', search);
    }

    return this.api.get('clients', params);
  }

  getById(id: string): Observable<any> {
    return this.api.get(`clients/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.api.post('clients', payload);
  }

  update(id: string, payload: any): Observable<any> {
    return this.api.post(`clients/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`clients/${id}`);
  }
}