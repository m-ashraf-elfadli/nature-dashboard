import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
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
}
