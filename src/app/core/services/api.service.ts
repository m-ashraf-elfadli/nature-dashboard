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

  private culture: string = localStorage.getItem('app_lang') || 'en';

  // =============================
  // Culture
  // =============================
  setCulture(val: string) {
    this.culture = val;
  }

  getCulture(): string {
    return this.culture;
  }

  // =============================
  // Helpers
  // =============================
  private buildHeaders(headers?: HttpHeaders): HttpHeaders {
    let finalHeaders = headers ?? new HttpHeaders();

    // always send Accept-Language
    if (!finalHeaders.has('locale')) {
      finalHeaders = finalHeaders.set('locale', this.culture);
    }

    return finalHeaders;
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
      headers: this.buildHeaders(headers)
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
      `${this.baseUrl}/${endpoint}`,
      body,
      {
        headers: this.buildHeaders(headers)
      }
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
      {
        headers: this.buildHeaders(headers)
      }
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
      {
        headers: this.buildHeaders(headers)
      }
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
      {
        params,
        headers: this.buildHeaders(headers)
      }
    );
  }
}