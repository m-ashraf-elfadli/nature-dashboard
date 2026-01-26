import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  send(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'en', // <-- هنا
    });
    return this.http.post(`${this.baseUrl}/services`, body, { headers });
  }
}
