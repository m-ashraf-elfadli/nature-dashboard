import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/`;
  export(endPoint:string):Observable<any>{
    return this.http.get(this.baseUrl + endPoint+'/actions/export',{
        responseType: 'blob',
        observe: 'response'
    })
  }
}
