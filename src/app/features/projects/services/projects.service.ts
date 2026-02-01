import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { count, Observable } from 'rxjs';
import {
  DropDownOption,
  PaginationResponse,
} from '../../../core/models/global.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = 'projects';

  create(
    body: any,
    culture = localStorage.getItem('app_lang'),
  ): Observable<any> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.post(this.endpoint, body);
  }
  getCountries(): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get('countries');
  }
  getCitiesByCountry(
    countryId: string,
  ): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get(`cities/country/${countryId}`);
  }
  getServicesDropDown(): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get(`services/names`);
  }
  getById(id: string): Observable<any> {
    return this.apiService.get(`projects/${id}`);
  }
}
