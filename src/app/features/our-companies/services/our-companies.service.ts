import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  GetByIdResponse,
  PaginationObj,
  PaginationResponse,
} from '../../../core/models/global.interface';
import { ApiService } from '../../../core/services/api.service';
import { ExportService } from '../../../shared/services/export.service';
import { parseApiDate, toLocaleStatus, toMediaUrl } from '../../../shared/utils/api-date.util';
import {
  Company,
  CompanyApi,
  CompanyPayload,
  CompanyRow,
  CompanyRowApi,
  SocialPlatform,
} from '../models/our-companies.model';

type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class OurCompaniesService {
  private readonly api = inject(ApiService);
  private readonly exportService = inject(ExportService);
  private readonly translate = inject(TranslateService);
  private readonly path = 'companies';

  private get uiLang(): Lang {
    return (localStorage.getItem('app_lang') as Lang) || 'en';
  }

  /** `GET /companies`: searches name and location in the UI language. */
  getCompanies(pagination: PaginationObj, search = ''): Observable<PaginationResponse<CompanyRow>> {
    let params = new HttpParams().set('page', pagination.page).set('size', pagination.size);
    if (search) params = params.set('value', search).set('key', 'all');
    this.api.setCulture(this.uiLang);
    return this.api
      .get<PaginationResponse<CompanyRowApi>>(this.path, params)
      .pipe(map((res) => ({ ...res, result: (res.result ?? []).map((c) => this.toRow(c)) })));
  }

  getCompany(id: string, lang: string): Observable<Company> {
    this.api.setCulture(lang);
    return this.api
      .get<GetByIdResponse<CompanyApi>>(`${this.path}/show/${id}`)
      .pipe(map((res) => this.fromApi(res.result)));
  }

  createCompany(payload: CompanyPayload, lang: string): Observable<Company> {
    this.api.setCulture(lang);
    return this.api
      .post<GetByIdResponse<CompanyApi>>(this.path, this.buildFormData(payload, false))
      .pipe(map((res) => this.fromApi(res.result)));
  }

  updateCompany(id: string, payload: CompanyPayload, lang: string): Observable<Company> {
    this.api.setCulture(lang);
    return this.api
      .post<GetByIdResponse<CompanyApi>>(`${this.path}/${id}`, this.buildFormData(payload, true))
      .pipe(map((res) => this.fromApi(res.result)));
  }

  /** Table status switch: `status` alone. */
  changeStatus(id: string, value: boolean): Observable<unknown> {
    this.api.setCulture(this.uiLang);
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.path}/${id}`, fd);
  }

  delete(id: string): Observable<unknown> {
    return this.api.delete(`${this.path}/${id}`);
  }

  bulkDelete(ids: string[]): Observable<unknown> {
    return this.api.post(`${this.path}/actions/bulk-delete`, { ids });
  }

  /** `GET /companies/actions/export` (CSV). */
  export(): void {
    this.exportService.exportModule(this.path);
  }

  /** Options for the Company Services multi-select (published services only). */
  getServiceOptions(lang: string): Observable<{ id: string; name: string }[]> {
    this.api.setCulture(lang);
    return this.api
      .get<{ result: { id: string; name: string }[] }>('services/names')
      .pipe(map((res) => res.result ?? []));
  }

  // ---------- mapping ----------

  private toRow(c: CompanyRowApi): CompanyRow {
    const updated = parseApiDate(c.updatedAt);
    return {
      id: c.id,
      name: c.name ?? '',
      // Relative path: the table's avatar column adds the media URL itself.
      logo: c.logo,
      location: c.location || '-',
      services_label: this.translate.instant('our_companies.list.services_count', {
        count: c.servicesCount ?? 0,
      }),
      updated_label: updated ? formatDate(updated, 'dd MMM yyyy', 'en') : '-',
      status: !!c.status,
    };
  }

  private fromApi(c: CompanyApi): Company {
    return {
      id: c.id,
      name: c.name ?? '',
      overview: c.overview ?? '',
      services_enabled: c.servicesPublish ?? true,
      service_ids: c.serviceIds ?? (c.services ?? []).map((s) => s.id),
      contact_enabled: c.contactPublish ?? true,
      location: c.location ?? '',
      email: c.email ?? '',
      website: c.website ?? '',
      social_enabled: c.socialPublish ?? true,
      social_links: (c.socialLinks ?? []).map((l) => ({
        id: l.id ?? null,
        platform: l.platform as SocialPlatform,
        url: l.url,
      })),
      logo: toMediaUrl(c.logo, environment.mediaUrl),
      watermark: toMediaUrl(c.cardWatermark, environment.mediaUrl),
      card_color: c.cardBackgroundColor ?? '',
      status: c.status === false ? 0 : 1,
      localeStatus: {
        en: toLocaleStatus(c.localizationStatus?.en),
        ar: toLocaleStatus(c.localizationStatus?.ar),
      },
    };
  }

  private buildFormData(p: CompanyPayload, isUpdate: boolean): FormData {
    const fd = new FormData();
    const bool = (value: boolean) => (value ? '1' : '0');
    fd.append('name', p.name);
    fd.append('overview', p.overview);
    fd.append('status', bool(!!p.status));
    fd.append('card_background_color', p.card_color ?? '');

    fd.append('services_publish', bool(p.services_enabled));
    // `service_ids` replaces the whole selection; kept even while the card is switched off.
    p.service_ids.forEach((id, i) => fd.append(`service_ids[${i}]`, id));

    fd.append('contact_publish', bool(p.contact_enabled));
    // Empty values clear the field (location: current language only).
    fd.append('location', p.location ?? '');
    fd.append('email', p.email ?? '');
    fd.append('website', p.website ?? '');

    fd.append('social_publish', bool(p.social_enabled));
    // Links with an id are updated, without are created, and links not sent are removed.
    p.social_links.forEach((link, i) => {
      if (link.id) fd.append(`social_links[${i}][id]`, link.id);
      fd.append(`social_links[${i}][platform]`, link.platform);
      fd.append(`social_links[${i}][url]`, link.url);
    });

    // Images: a File replaces; the logo cannot be removed; the watermark is removed with "null".
    if (p.logo instanceof File) fd.append('logo', p.logo);
    if (p.watermark instanceof File) fd.append('card_watermark', p.watermark);
    else if (!p.watermark && isUpdate) fd.append('card_watermark', 'null');
    return fd;
  }
}
