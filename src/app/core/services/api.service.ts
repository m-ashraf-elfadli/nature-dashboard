import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private readonly baseUrl = environment.baseUrl;
  private readonly http = inject(HttpClient);
  culture: string = 'en';

  setCulture(val: string) {
    this.culture = val;
  }

  // =============================
  // GET
  // =============================
  get<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      params,
      headers
    });
  }

  // =============================
  // POST
  // =============================
  post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/${endpoint}?culture=${this.culture}`,
      body,
      { headers }
    );
  }

  // =============================
  // PUT
  // =============================
  put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers }
    );
  }

  // =============================
  // PATCH
  // =============================
  patch<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.patch<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers }
    );
  }

  // =============================
  // DELETE
  // =============================
  delete<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}/${endpoint}`,
      { params, headers }
    );
  }
}
