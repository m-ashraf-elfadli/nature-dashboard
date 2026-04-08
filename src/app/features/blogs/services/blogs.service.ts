import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocaleComplete } from '../../projects/models/projects.interface';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { PaginationObj } from '../../../core/models/global.interface';
import {
  BlogCategory,
  BlogCategoryFormPayload,
  BlogPost,
  BlogPostFormPayload,
  BlogPostSection,
} from '../models/blogs.model';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private readonly api = inject(ApiService);

  private normalizeTagsValue(value: any): string {
    const tags = this.extractTagList(value);
    return tags.join(', ');
  }

  private extractTagList(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((item: any) => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') {
            return String(item.name ?? item.label ?? item.value ?? '').trim();
          }
          return String(item ?? '').trim();
        })
        .filter(Boolean);
    }
    return String(value)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  private toNumberSafe(value: any): number {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const raw = String(value ?? '').trim();
    if (!raw) return 0;
    const direct = Number(raw);
    if (Number.isFinite(direct)) return direct;
    const match = raw.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  private toBoolean(value: any, fallback = true): boolean {
    if (value === undefined || value === null) return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === '1' || v === 'true') return true;
      if (v === '0' || v === 'false') return false;
    }
    return fallback;
  }

  private categoriesPath(): string {
    return environment.blogs.categoriesApiPath;
  }

  private postsPath(): string {
    return environment.blogs.postsApiPath;
  }

  private mapCategoryListResponse(res: any): { result: BlogCategory[]; total: number } {
    const rows =
      res?.result ??
      res?.data ??
      res?.categories ??
      [];
    const list = Array.isArray(rows) ? rows.map((r) => this.mapCategoryRow(r)) : [];
    const total =
      Number(
        res?.total ??
          res?.meta?.total ??
          res?.meta?.pagination?.total,
      ) || list.length;
    return { result: list, total };
  }

  /** Map API row to table/form shape (type slug, names, image URL). */
  private mapCategoryRow(row: any): BlogCategory {
    if (!row || typeof row !== 'object') {
      return row;
    }
    const typeSlug = row.type ?? row.type_id ?? row.type_slug ?? '';
    const nameEn = row.name_en ?? row.nameEn ?? '';
    const nameAr = row.name_ar ?? row.nameAr ?? '';
    const displayName = row.name || nameEn || nameAr || '';
    return {
      id: String(row.id ?? ''),
      name: displayName,
      name_en: nameEn || displayName,
      name_ar: nameAr,
      type_id: String(typeSlug),
      type_label: row.type_label ?? row.type_name ?? '',
      image: row.image ?? row.image_url ?? row.thumbnail ?? '',
      created_at:
        row.created_at ?? row.createdAt ?? row.date ?? '',
      status:
        row.status === true ||
        row.status === 1 ||
        row.status === '1' ||
        row.is_active === true,
    };
  }

  // --- Categories ---

  getCategories(pagination: PaginationObj, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    if (search) {
      params = params.set('value', search);
    }
    return this.api
      .get<any>(this.categoriesPath(), params)
      .pipe(map((res) => this.mapCategoryListResponse(res)));
  }

  getCategoryById(id: string): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.get<any>(`${this.categoriesPath()}/${id}`).pipe(
      map((res) => ({
        ...res,
        result: this.mapCategoryRow(res?.result ?? res?.data ?? res),
      })),
    );
  }

  createCategory(payload: BlogCategoryFormPayload): Observable<any> {
    const fd = this.buildCategoryFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(this.categoriesPath(), fd);
  }

  updateCategory(id: string, payload: BlogCategoryFormPayload): Observable<any> {
    const fd = this.buildCategoryFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(`${this.categoriesPath()}/${id}`, fd);
  }

  private buildCategoryFormData(p: BlogCategoryFormPayload): FormData {
    const fd = new FormData();
    fd.append('name_en', p.name_en);
    fd.append('name_ar', p.name_ar);
    // API collection expects `type` (slug), not `type_id`
    fd.append('type', p.type_id);
    if (p.image instanceof File) {
      fd.append('image', p.image);
    }
    return fd;
  }

  deleteCategory(id: string): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.delete(`${this.categoriesPath()}/${id}`);
  }

  bulkDeleteCategories(ids: string[]): Observable<any> {
    return this.api.post(`${this.categoriesPath()}/actions/bulk-delete`, {
      ids,
    });
  }

  changeCategoryStatus(id: string, value: boolean): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.categoriesPath()}/${id}`, fd);
  }

  // --- Posts ---

  getPosts(pagination: PaginationObj, search?: string, culture?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('limit', pagination.size.toString())
      .set('per_page', pagination.size.toString());
    if (search) {
      params = params.set('value', search);
    }
    const activeCulture = culture || localStorage.getItem('app_lang') || 'en';
    this.api.setCulture(activeCulture);
    return this.api.get(this.postsPath(), params).pipe(
      map((res: any) => {
        const rows =
          res?.result?.data ??
          res?.result?.items ??
          res?.result ??
          res?.data?.data ??
          res?.data?.items ??
          res?.data ??
          res?.items ??
          res?.blogs ??
          [];
        const list = Array.isArray(rows)
          ? rows.map((row: any) => this.normalizePostRow(row, activeCulture))
          : [];
        const directTotal = this.toNumberSafe(
          res?.total ??
            res?.count ??
            res?.recordsTotal ??
            res?.meta?.total ??
            res?.meta?.count ??
            res?.meta?.pagination?.total ??
            res?.meta?.pagination?.total_count ??
            res?.pagination?.total ??
            res?.pagination?.count ??
            res?.result?.total ??
            res?.result?.count ??
            res?.result?.meta?.total ??
            res?.result?.meta?.pagination?.total ??
            res?.result?.pagination?.total ??
            res?.data?.total ??
            res?.data?.count ??
            res?.data?.meta?.total ??
            res?.data?.meta?.pagination?.total,
        );
        const lastPage = this.toNumberSafe(
          res?.last_page ??
            res?.meta?.last_page ??
            res?.meta?.pagination?.last_page ??
            res?.pagination?.last_page ??
            res?.result?.last_page ??
            res?.result?.meta?.last_page ??
            res?.result?.meta?.pagination?.last_page ??
            res?.data?.last_page ??
            res?.data?.meta?.last_page ??
            res?.data?.meta?.pagination?.last_page,
        );
        const perPage = this.toNumberSafe(
          res?.per_page ??
            res?.meta?.per_page ??
            res?.meta?.pagination?.per_page ??
            res?.pagination?.per_page ??
            res?.result?.per_page ??
            res?.result?.meta?.per_page ??
            res?.result?.meta?.pagination?.per_page ??
            res?.data?.per_page ??
            res?.data?.meta?.per_page ??
            res?.data?.meta?.pagination?.per_page ??
            pagination.size,
        );
        const total =
          (Number.isFinite(directTotal) && directTotal > 0 ? directTotal : 0) ||
          (Number.isFinite(lastPage) && lastPage > 0 && perPage > 0
            ? lastPage * perPage
            : 0) ||
          list.length;

        return {
          ...res,
          result: list,
          total,
        };
      }),
    );
  }

  private normalizePostRow(row: any, culture = 'en'): BlogPost {
    const viewsRaw = row.views ?? row.view_count ?? row.views_count ?? 0;
    const views =
      typeof viewsRaw === 'number' ? viewsRaw : Number(viewsRaw) || 0;
    const lc: LocaleComplete =
      row.localeComplete ??
      row.locale_complete ??
      ({
        en: row.locale_en_complete !== false,
        ar: row.locale_ar_complete === true,
      } as LocaleComplete);
    const imageValue =
      typeof row.image === 'string'
        ? row.image
        : row.image?.url ?? row.image_url ?? row.thumbnail ?? '';
    const createdAtValue =
      row.created_at ??
      row.createdAt ??
      row.date ??
      row.created_on ??
      row.creation_date ??
      '';
    const categoryName =
      row.category_name ??
      (culture === 'ar'
        ? row.category?.name_ar ?? row.category?.nameAr
        : row.category?.name_en ?? row.category?.nameEn) ??
      row.category?.name ??
      '';
    return {
      ...row,
      title: row.title ?? row.name ?? row.title_en ?? '',
      title_en: row.title_en ?? row.name_en ?? '',
      title_ar: row.title_ar ?? row.name_ar ?? '',
      category_id: String(row.category_id ?? row['category*id'] ?? row.category?.id ?? ''),
      category_name: categoryName,
      image: imageValue,
      created_at: String(createdAtValue || ''),
      sections: (row.sections || []).map((s: any) => ({
        id: s.id ?? '',
        enabled: this.toBoolean(s.enabled ?? s.status, false),
        title: s.title ?? '',
        subtitle_html: s.subtitle_html ?? s.subtitle ?? '',
        image: s.image ?? '',
        quote: s.quote ?? '',
        tags: this.normalizeTagsValue(s.tags ?? s.section_tags ?? s.sectionTags),
      })),
      tags: this.normalizeTagsValue(row.tags ?? row.section_tags ?? row.sectionTags),
      views,
      localeComplete: {
        en: !!lc.en,
        ar: !!lc.ar,
      },
    } as BlogPost;
  }

  getPostById(id: string, culture?: string): Observable<any> {
    const activeCulture = culture || localStorage.getItem('app_lang') || 'en';
    this.api.setCulture(activeCulture);
    return this.api.get(`${this.postsPath()}/${id}`).pipe(
      map((res: any) => ({
        ...res,
        result: res?.result ? this.normalizePostRow(res.result, activeCulture) : null,
      })),
    );
  }

  createPost(payload: BlogPostFormPayload, culture?: string): Observable<any> {
    const activeCulture = culture || localStorage.getItem('app_lang') || 'en';
    const fd = this.buildPostFormData(payload, activeCulture, false);
    this.api.setCulture(activeCulture);
    return this.api.post(this.postsPath(), fd);
  }

  updatePost(id: string, payload: BlogPostFormPayload, culture?: string): Observable<any> {
    const activeCulture = culture || localStorage.getItem('app_lang') || 'en';
    const fd = this.buildPostFormData(payload, activeCulture, true);
    this.api.setCulture(activeCulture);
    return this.api.post(`${this.postsPath()}/${id}`, fd);
  }

  private buildPostFormData(
    p: BlogPostFormPayload,
    culture: string,
    isUpdate: boolean,
  ): FormData {
    const fd = new FormData();
    const localizedName = culture === 'ar' ? p.title_ar : p.title_en;
    fd.append('name', localizedName || p.title_en || p.title_ar || '');
    fd.append('category_id', String(p.category_id));
    if (p.image instanceof File) {
      fd.append('image', p.image);
    } else if (!isUpdate && typeof p.image === 'string' && p.image) {
      fd.append('image', p.image);
    }
    fd.append('status', p.status === 1 ? '1' : '0');

    // Tags are sent at root level: tags[0], tags[1], ...
    const rootTags = Array.from(
      new Set(
        (p.sections || [])
          .flatMap((s) =>
            String(s.tags || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean),
          )
          .filter(Boolean),
      ),
    );
    rootTags.forEach((tag, tagIndex) => fd.append(`tags[${tagIndex}]`, tag));

    (p.sections || []).forEach((s, i) => {
      if (s.id) {
        fd.append(`sections[${i}][id]`, String(s.id));
      }
      fd.append(`sections[${i}][title]`, s.title || '');
      fd.append(`sections[${i}][subtitle]`, s.subtitle_html || '');
      fd.append(`sections[${i}][quote]`, s.quote || '');
      fd.append(`sections[${i}][status]`, s.enabled ? '1' : '0');
      if (s.image instanceof File) {
        fd.append(`sections[${i}][image]`, s.image);
      } else if (!isUpdate && typeof s.image === 'string' && s.image) {
        fd.append(`sections[${i}][image]`, s.image);
      }
    });
    return fd;
  }

  deletePost(id: string): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.delete(`${this.postsPath()}/${id}`);
  }

  bulkDeletePosts(ids: string[]): Observable<any> {
    return this.api.post(`${this.postsPath()}/actions/bulk-delete`, { ids });
  }

  changePostStatus(id: string, value: boolean): Observable<any> {
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.postsPath()}/${id}`, fd);
  }

  /** Post form: all categories as select options. */
  getCategoriesForDropdown(culture?: string): Observable<{ id: string; name: string }[]> {
    this.api.setCulture(culture || localStorage.getItem('app_lang') || 'en');
    return this.api.get<any>(`${this.categoriesPath()}/published`).pipe(
      map((res: any) => {
        const rows =
          res?.result ??
          res?.data ??
          res?.categories ??
          res?.items ??
          [];
        const list = Array.isArray(rows) ? rows : [];
        return list
          .map((row) => this.mapCategoryRow(row))
          .filter((c: BlogCategory) => !!c?.id)
          .map((c: BlogCategory) => ({
            id: c.id,
            name: c.name || c.name_en || c.name_ar,
          }));
      }),
      catchError(() =>
        this.getCategories({ page: 1, size: 500 }, '').pipe(
          map((res: any) =>
            (res.result || []).map((c: BlogCategory) => ({
              id: c.id,
              name: c.name || c.name_en || c.name_ar,
            })),
          ),
          catchError(() => of([])),
        ),
      ),
    );
  }
}
