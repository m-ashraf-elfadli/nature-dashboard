import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { PaginationObj } from '../../../core/models/global.interface';
import {
  EnvironmentalEvent,
  EnvironmentalEventFormPayload,
} from '../models/environmental-calendar.model';

@Injectable({ providedIn: 'root' })
export class EnvironmentalCalendarService {
  private readonly api = inject(ApiService);

  private readonly path = 'environmental-events';

  private toRowsArray<T = any>(rows: any): T[] {
    if (Array.isArray(rows)) return rows as T[];
    if (!rows || typeof rows !== 'object') return [];
    if ('id' in rows) return [rows as T];
    const values = Object.values(rows);
    return values.every((v) => v && typeof v === 'object') ? (values as T[]) : [];
  }

  private mapRow(row: any): EnvironmentalEvent {
    if (!row || typeof row !== 'object') {
      return row;
    }
    const titleEn = row.title_en ?? row.titleEn ?? '';
    const titleAr = row.title_ar ?? row.titleAr ?? '';
    const displayTitle = row.title || titleEn || titleAr || '';
    return {
      id: String(row.id ?? ''),
      title: displayTitle,
      title_en: titleEn || displayTitle,
      title_ar: titleAr,
      event_type: String(row.eventType ?? row.event_type ?? ''),
      event_type_label: '',
      event_color: String(row.eventColor ?? row.event_color ?? ''),
      event_date: String(row.eventDate ?? row.event_date ?? ''),
      image: row.image ?? row.image_url ?? '',
      status:
        row.status === true ||
        row.status === 1 ||
        row.status === '1' ||
        row.is_active === true,
    };
  }

  private mapListResponse(res: any): { result: EnvironmentalEvent[]; total: number } {
    const rows = res?.result ?? res?.data ?? [];
    const list = Array.isArray(rows) ? rows.map((r) => this.mapRow(r)) : [];
    const total =
      Number(res?.total ?? res?.meta?.total ?? res?.meta?.pagination?.total) ||
      list.length;
    return { result: list, total };
  }

  getEvents(pagination: PaginationObj, search?: string): Observable<{ result: EnvironmentalEvent[]; total: number }> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    if (search) {
      params = params.set('value', search);
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.get<any>(this.path, params).pipe(map((res) => this.mapListResponse(res)));
  }

  getEventById(id: string): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.get<any>(`${this.path}/${id}`).pipe(
      map((res) => ({
        ...res,
        result: this.mapRow(res?.result ?? res?.data ?? res),
      })),
    );
  }

  createEvent(payload: EnvironmentalEventFormPayload): Observable<any> {
    const fd = this.buildFormData(payload, false);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(this.path, fd);
  }

  updateEvent(id: string, payload: EnvironmentalEventFormPayload): Observable<any> {
    const fd = this.buildFormData(payload, true);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(`${this.path}/${id}`, fd);
  }

  private buildFormData(p: EnvironmentalEventFormPayload, isUpdate: boolean): FormData {
    const fd = new FormData();
    fd.append('title_en', p.title_en);
    fd.append('title_ar', p.title_ar);
    fd.append('event_type', p.event_type);
    fd.append('event_color', p.event_color);
    fd.append('event_date', p.event_date);
    if (p.image instanceof File) {
      fd.append('image', p.image);
    } else if (!isUpdate && typeof p.image === 'string' && p.image) {
      fd.append('image', p.image);
    }
    return fd;
  }

  deleteEvent(id: string): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.delete(`${this.path}/${id}`);
  }

  bulkDeleteEvents(ids: string[]): Observable<any> {
    return this.api.post(`${this.path}/actions/bulk-delete`, { ids });
  }

  changeEventStatus(id: string, value: boolean): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.path}/${id}`, fd);
  }
}
