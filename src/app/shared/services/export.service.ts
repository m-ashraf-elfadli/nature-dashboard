import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  exportModule(endPoint:string){
    this.export(endPoint).subscribe({
      next:(res)=>{
        const blob = res.body;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${endPoint}.csv`;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    })
  }
}
