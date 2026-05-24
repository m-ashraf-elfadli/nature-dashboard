import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/`;

  importFile(endpoint: string, file: File, fieldName = 'file'): Observable<any> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.http.post(this.resolveEndpoint(endpoint), formData);
  }

  downloadTemplate(endpoint: string): Observable<Blob> {
    return this.http.get(this.resolveEndpoint(endpoint), {
      responseType: 'blob',
    });
  }

  getTemplateHeaders(endpoint: string): Observable<string[]> {
    return this.http.get<unknown>(this.resolveEndpoint(endpoint)).pipe(
      map((res) => this.normalizeHeadersResponse(res)),
    );
  }

  downloadTemplateFromHeaders(headers: string[], fileName: string) {
    const csvHeaders = headers.join(',');
    this.downloadBlob(new Blob([`${csvHeaders}\n`], { type: 'text/csv;charset=utf-8;' }), fileName);
  }

  downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  private resolveEndpoint(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    return this.baseUrl + endpoint;
  }

  private normalizeHeadersResponse(res: unknown): string[] {
    if (Array.isArray(res)) {
      return res.map(String);
    }

    if (res && typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      const headers =
        obj['templateHeaders'] ||
        obj['headers'] ||
        obj['result'] ||
        obj['data'];

      if (Array.isArray(headers)) {
        return headers.map(String);
      }
    }

    return [];
  }
}
