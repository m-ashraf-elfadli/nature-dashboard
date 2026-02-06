import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { count, Observable } from 'rxjs';
import {
  DropDownOption,
  GetByIdResponse,
  PaginationObj,
  PaginationResponse,
} from '../../../core/models/global.interface';
import { HttpParams } from '@angular/common/http';
import { Project, ProjectById } from '../models/projects.interface';

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
  update(
    id: string,
    body: any,
    culture = localStorage.getItem('app_lang'),
  ): Observable<any> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.post(`${this.endpoint}/${id}`, body);
  }
  getAll(
    pagination: PaginationObj,
    search?: string,
    filter?: any,
  ): Observable<PaginationResponse<Project>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('size', pagination.size);

    if (search) {
      params = params.set('value', search);
    }
    if (filter) {
      Object.keys(filter).forEach((filterKey) => {
        const value = filter[filterKey];

        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v !== null && v !== undefined) {
              params = params.append(`${filterKey}[]`, v);
            }
          });
        } else {
          params = params.set(filterKey, value);
        }
      });
    }
    return this.apiService.get(this.endpoint, params);
  }
  getById(
    id: string,
    culture: string,
  ): Observable<GetByIdResponse<ProjectById>> {
    this.apiService.setCulture(culture || 'en');
    return this.apiService.get(`${this.endpoint}/show/${id}`);
  }
  delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
  bulkDelete(ids:string[]):Observable<any>{
    let payload = {
      ids
    }
    return this.apiService.post(`${this.endpoint}/actions/bulk-delete`,payload)
  }
  getCountries(): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get('countries');
  }
  getAllCities(): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get('cities');
  }
  getCitiesByCountry(
    countryId: string,
  ): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get(`cities/country/${countryId}`);
  }
  getServicesDropDown(): Observable<PaginationResponse<DropDownOption>> {
    return this.apiService.get(`services/names`);
  }
  changeStatus(id:string,value:boolean){
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData:FormData = new FormData();
    formData.append('status',value?'1':'0')
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}
