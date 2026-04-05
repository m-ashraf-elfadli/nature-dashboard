import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { count, Observable } from 'rxjs';
import {
  DropDownOption,
  GetByIdResponse,
  PaginationObj,
  PaginationResponse,
} from '../../../core/models/global.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Project, ProjectById } from '../models/projects.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly apiService = inject(ApiService);
  private readonly http = inject(HttpClient);
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
    const body = {
      ...pagination,
      ...filter,
      value:search
    }
    return this.apiService.post(this.endpoint+'/search/all-projects', body);
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
  getCountriesWithHTTP(culture: string): Observable<PaginationResponse<DropDownOption>> {
    const headers = new HttpHeaders({
      locale: culture
    });

    return this.http.get<PaginationResponse<DropDownOption>>(
      environment.baseUrl + '/countries',
      { headers }
    );
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
  getServicesDropDownWithHTTP(culture: string): Observable<PaginationResponse<DropDownOption>> {
    const headers = new HttpHeaders({
      locale: culture
    });

    return this.http.get<PaginationResponse<DropDownOption>>(
      environment.baseUrl + '/services/names',
      { headers }
    );
  }
  changeStatus(id:string,value:boolean){
    this.apiService.setCulture(localStorage.getItem('app_lang') || 'en');
    let formData:FormData = new FormData();
    formData.append('status',value?'1':'0')
    return this.apiService.post(`${this.endpoint}/${id}`, formData);
  }
}
