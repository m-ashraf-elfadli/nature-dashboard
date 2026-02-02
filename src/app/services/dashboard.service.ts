import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor() {}
  private apiService = inject(ApiService);
  private endpoint = 'statistics';
  private lang = this.apiService.getCulture();

  getDashboardStatistics(): Observable<any> {
    return this.apiService.get(this.endpoint);
  }
}
