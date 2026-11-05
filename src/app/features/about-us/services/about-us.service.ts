import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { GetByIdResponse } from '../../../core/models/global.interface';
import { parseApiDate, toLocaleStatus, toMediaUrl } from '../../../shared/utils/api-date.util';
import { AboutUs, AboutUsApi, AboutUsPayload } from '../models/about-us.model';

@Injectable({ providedIn: 'root' })
export class AboutUsService {
  private readonly api = inject(ApiService);
  private readonly path = 'about-us';

  /** `GET /about-us`: returns an empty shape when nothing has been saved yet. */
  getAboutUs(lang: string): Observable<AboutUs> {
    this.api.setCulture(lang);
    return this.api
      .get<GetByIdResponse<AboutUsApi>>(this.path)
      .pipe(map((res) => this.fromApi(res.result)));
  }

  /** `POST /about-us` (upsert). Text is saved into the `locale` language only. */
  updateAboutUs(payload: AboutUsPayload, lang: string): Observable<AboutUs> {
    this.api.setCulture(lang);
    return this.api
      .post<GetByIdResponse<AboutUsApi>>(this.path, this.buildFormData(payload))
      .pipe(map((res) => this.fromApi(res.result)));
  }

  private fromApi(a: AboutUsApi | null | undefined): AboutUs {
    return {
      title: a?.sectionTitle ?? '',
      description: a?.sectionDescription ?? '',
      highlights_enabled: a?.highlightsPublish ?? true,
      highlights: (a?.highlights ?? []).map((h) => ({
        id: h.id ?? null,
        title: h.title ?? '',
        description: h.description ?? '',
      })),
      statistics_enabled: a?.statisticsPublish ?? true,
      statistics: (a?.statistics ?? []).map((s) => ({
        id: s.id ?? null,
        value: s.metricValue ?? '',
        label: s.label ?? '',
      })),
      founder_image: toMediaUrl(a?.founderImage, environment.mediaUrl),
      founder_name: a?.founderName ?? '',
      founder_title: a?.founderTitle ?? '',
      status: a?.status === false ? 0 : 1,
      localeStatus: {
        en: toLocaleStatus(a?.localizationStatus?.en),
        ar: toLocaleStatus(a?.localizationStatus?.ar),
      },
      updated_at: parseApiDate(a?.updatedAt),
    };
  }

  private buildFormData(p: AboutUsPayload): FormData {
    const fd = new FormData();
    fd.append('section_title', p.title);
    fd.append('section_description', p.description);
    fd.append('status', p.status ? '1' : '0');

    // A switched-off section keeps its rows (the API only requires them while it is on).
    fd.append('highlights_publish', p.highlights_enabled ? '1' : '0');
    p.highlights
      .filter((h) => h.title || h.description)
      .forEach((h, i) => {
        if (h.id) fd.append(`highlights[${i}][id]`, h.id);
        fd.append(`highlights[${i}][title]`, h.title);
        fd.append(`highlights[${i}][description]`, h.description);
      });

    fd.append('statistics_publish', p.statistics_enabled ? '1' : '0');
    p.statistics
      .filter((s) => s.value || s.label)
      .forEach((s, i) => {
        if (s.id) fd.append(`statistics[${i}][id]`, s.id);
        fd.append(`statistics[${i}][metric_value]`, s.value);
        fd.append(`statistics[${i}][label]`, s.label);
      });

    fd.append('founder_name', p.founder_name);
    fd.append('founder_title', p.founder_title);

    // New file → upload; null → remove; existing URL → leave untouched.
    if (p.founder_image instanceof File) fd.append('image', p.founder_image);
    else if (!p.founder_image) fd.append('image', 'null');
    return fd;
  }
}
