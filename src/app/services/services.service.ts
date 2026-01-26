import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor() {}
  private apiService = inject(ApiService);
  private endpoint = 'services';

  createService(body: any) {
    return this.apiService.post(this.endpoint, body);
  }
  getAllServices() {
    return this.apiService.get(this.endpoint);
  }
}
