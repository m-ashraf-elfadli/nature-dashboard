import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
import {
  createInitialDummyCategories,
  createInitialDummyPosts,
} from '../data/blog-dummy.data';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private readonly api = inject(ApiService);
  private dummyCategories: BlogCategory[] = createInitialDummyCategories();
  private dummyPosts: BlogPost[] = createInitialDummyPosts();

  private categoriesPath(): string {
    return environment.blogs.categoriesApiPath;
  }

  private postsPath(): string {
    return environment.blogs.postsApiPath;
  }

  private useDummy(): boolean {
    return environment.blogs.useDummyData;
  }

  // --- Categories ---

  getCategories(pagination: PaginationObj, search?: string): Observable<any> {
    if (this.useDummy()) {
      return of(this.sliceCategories(pagination, search || ''));
    }
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    if (search) {
      params = params.set('value', search);
    }
    return this.api.get(this.categoriesPath(), params);
  }

  private sliceCategories(pagination: PaginationObj, search: string) {
    let list = [...this.dummyCategories];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.name_en.toLowerCase().includes(q) ||
          c.name_ar.includes(search),
      );
    }
    const total = list.length;
    const start = (pagination.page - 1) * pagination.size;
    const result = list.slice(start, start + pagination.size);
    return { result, total };
  }

  getCategoryById(id: string): Observable<any> {
    if (this.useDummy()) {
      const row = this.dummyCategories.find((c) => c.id === id) || null;
      return of({ result: row });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.get(`${this.categoriesPath()}/show/${id}`);
  }

  createCategory(payload: BlogCategoryFormPayload): Observable<any> {
    if (this.useDummy()) {
      const nextNum =
        this.dummyCategories.reduce(
          (m, c) => Math.max(m, parseInt(c.id, 10) || 0),
          0,
        ) + 1;
      const id = String(nextNum);
      const row: BlogCategory = {
        id,
        name: payload.name_en,
        name_en: payload.name_en,
        name_ar: payload.name_ar,
        type_id: payload.type_id,
        type_label: '',
        image:
          typeof payload.image === 'string'
            ? payload.image
            : `https://picsum.photos/seed/bcat${id}/96/64`,
        created_at: new Date().toISOString().slice(0, 10),
        status: true,
      };
      this.dummyCategories = [...this.dummyCategories, row];
      return of({ result: row });
    }
    const fd = this.buildCategoryFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(this.categoriesPath(), fd);
  }

  updateCategory(id: string, payload: BlogCategoryFormPayload): Observable<any> {
    if (this.useDummy()) {
      const idx = this.dummyCategories.findIndex((c) => c.id === id);
      if (idx < 0) return of({ result: null });
      const prev = this.dummyCategories[idx];
      const row: BlogCategory = {
        ...prev,
        name: payload.name_en,
        name_en: payload.name_en,
        name_ar: payload.name_ar,
        type_id: payload.type_id,
        image:
          typeof payload.image === 'string'
            ? payload.image
            : payload.image instanceof File
              ? `https://picsum.photos/seed/bcat${id}u/96/64`
              : prev.image,
      };
      this.dummyCategories = this.dummyCategories.map((c, i) =>
        i === idx ? row : c,
      );
      return of({ result: row });
    }
    const fd = this.buildCategoryFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(`${this.categoriesPath()}/${id}`, fd);
  }

  private buildCategoryFormData(p: BlogCategoryFormPayload): FormData {
    const fd = new FormData();
    fd.append('name_en', p.name_en);
    fd.append('name_ar', p.name_ar);
    fd.append('type_id', p.type_id);
    if (p.image instanceof File) {
      fd.append('image', p.image);
    } else if (typeof p.image === 'string' && p.image) {
      fd.append('image', p.image);
    }
    return fd;
  }

  deleteCategory(id: string): Observable<any> {
    if (this.useDummy()) {
      this.dummyCategories = this.dummyCategories.filter((c) => c.id !== id);
      this.dummyPosts = this.dummyPosts.filter((p) => p.category_id !== id);
      return of({ success: true });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.delete(`${this.categoriesPath()}/${id}`);
  }

  bulkDeleteCategories(ids: string[]): Observable<any> {
    if (this.useDummy()) {
      this.dummyCategories = this.dummyCategories.filter(
        (c) => !ids.includes(c.id),
      );
      this.dummyPosts = this.dummyPosts.filter(
        (p) => !ids.includes(p.category_id),
      );
      return of({ success: true });
    }
    return this.api.post(`${this.categoriesPath()}/actions/bulk-delete`, {
      ids,
    });
  }

  changeCategoryStatus(id: string, value: boolean): Observable<any> {
    if (this.useDummy()) {
      this.dummyCategories = this.dummyCategories.map((c) =>
        c.id === id ? { ...c, status: value } : c,
      );
      return of({ success: true });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.categoriesPath()}/${id}`, fd);
  }

  // --- Posts ---

  getPosts(pagination: PaginationObj, search?: string): Observable<any> {
    if (this.useDummy()) {
      return of(this.slicePosts(pagination, search || ''));
    }
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    if (search) {
      params = params.set('value', search);
    }
    return this.api.get(this.postsPath(), params).pipe(
      map((res: any) => ({
        ...res,
        result: (res.result || []).map((row: any) => this.normalizePostRow(row)),
      })),
    );
  }

  private normalizePostRow(row: any): BlogPost {
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
    return {
      ...row,
      views,
      localeComplete: {
        en: !!lc.en,
        ar: !!lc.ar,
      },
    } as BlogPost;
  }

  private slicePosts(pagination: PaginationObj, search: string) {
    let list = [...this.dummyPosts];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        if (
          p.title.toLowerCase().includes(q) ||
          p.title_en.toLowerCase().includes(q) ||
          p.title_ar.includes(search) ||
          p.category_name.toLowerCase().includes(q)
        ) {
          return true;
        }
        return (p.sections || []).some((s) =>
          [s.title, s.quote, s.tags, s.subtitle_html].some((x) =>
            String(x || '')
              .toLowerCase()
              .includes(q),
          ),
        );
      });
    }
    const total = list.length;
    const start = (pagination.page - 1) * pagination.size;
    const result = list.slice(start, start + pagination.size);
    return { result, total };
  }

  getPostById(id: string): Observable<any> {
    if (this.useDummy()) {
      const row = this.dummyPosts.find((p) => p.id === id) || null;
      return of({ result: row });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.get(`${this.postsPath()}/show/${id}`).pipe(
      map((res: any) => ({
        ...res,
        result: res.result ? this.normalizePostRow(res.result) : null,
      })),
    );
  }

  createPost(payload: BlogPostFormPayload): Observable<any> {
    if (this.useDummy()) {
      const nextNum =
        this.dummyPosts.reduce(
          (m, p) => Math.max(m, parseInt(p.id.replace(/\D/g, ''), 10) || 0),
          0,
        ) + 1;
      const id = `p${nextNum}`;
      const cat = this.dummyCategories.find((c) => c.id === payload.category_id);
      const row: BlogPost = {
        id,
        title: payload.title_en,
        title_en: payload.title_en,
        title_ar: payload.title_ar,
        category_id: payload.category_id,
        category_name: cat?.name_en || '',
        views: 0,
        localeComplete: {
          en: !!(payload.title_en || '').trim(),
          ar: !!(payload.title_ar || '').trim(),
        },
        image:
          typeof payload.image === 'string'
            ? payload.image
            : `https://picsum.photos/seed/bpost${id}/96/64`,
        created_at: new Date().toISOString().slice(0, 10),
        status: payload.status === 1,
        sections: this.mapPayloadSections(id, payload),
      };
      this.dummyPosts = [...this.dummyPosts, row];
      return of({ result: row });
    }
    const fd = this.buildPostFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(this.postsPath(), fd);
  }

  private mapPayloadSections(
    postId: string,
    payload: BlogPostFormPayload,
    prev?: BlogPost,
  ): BlogPostSection[] {
    return (payload.sections || []).map((s, i) => {
      const prevImg = prev?.sections?.[i]?.image || '';
      let imageStr = '';
      if (typeof s.image === 'string' && s.image) {
        imageStr = s.image;
      } else if (s.image instanceof File) {
        imageStr = `https://picsum.photos/seed/bpost${postId}sec${i}/400/240`;
      } else {
        imageStr = prevImg;
      }
      return {
        enabled: s.enabled,
        title: s.title,
        subtitle_html: s.subtitle_html,
        quote: s.quote,
        tags: s.tags,
        image: imageStr,
      };
    });
  }

  updatePost(id: string, payload: BlogPostFormPayload): Observable<any> {
    if (this.useDummy()) {
      const idx = this.dummyPosts.findIndex((p) => p.id === id);
      if (idx < 0) return of({ result: null });
      const prev = this.dummyPosts[idx];
      const cat = this.dummyCategories.find((c) => c.id === payload.category_id);
      const row: BlogPost = {
        ...prev,
        title: payload.title_en,
        title_en: payload.title_en,
        title_ar: payload.title_ar,
        category_id: payload.category_id,
        category_name: cat?.name_en || prev.category_name,
        views: prev.views ?? 0,
        localeComplete: {
          en: !!(payload.title_en || '').trim(),
          ar: !!(payload.title_ar || '').trim(),
        },
        image:
          typeof payload.image === 'string'
            ? payload.image
            : payload.image instanceof File
              ? `https://picsum.photos/seed/bpost${id}u/96/64`
              : prev.image,
        status: payload.status === 1,
        sections: this.mapPayloadSections(id, payload, prev),
      };
      this.dummyPosts = this.dummyPosts.map((p, i) => (i === idx ? row : p));
      return of({ result: row });
    }
    const fd = this.buildPostFormData(payload);
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.post(`${this.postsPath()}/${id}`, fd);
  }

  private buildPostFormData(p: BlogPostFormPayload): FormData {
    const fd = new FormData();
    fd.append('title_en', p.title_en);
    fd.append('title_ar', p.title_ar);
    fd.append('category_id', String(p.category_id));
    if (p.image instanceof File) {
      fd.append('image', p.image);
    } else if (typeof p.image === 'string' && p.image) {
      fd.append('image', p.image);
    }
    fd.append('status', p.status === 1 ? '1' : '0');
    const meta = (p.sections || []).map((s, i) => ({
      enabled: s.enabled,
      title: s.title,
      subtitle_html: s.subtitle_html,
      quote: s.quote,
      tags: s.tags,
      image: typeof s.image === 'string' ? s.image : null,
      index: i,
    }));
    fd.append('sections_json', JSON.stringify(meta));
    (p.sections || []).forEach((s, i) => {
      if (s.image instanceof File) {
        fd.append(`section_image_${i}`, s.image);
      }
    });
    return fd;
  }

  deletePost(id: string): Observable<any> {
    if (this.useDummy()) {
      this.dummyPosts = this.dummyPosts.filter((p) => p.id !== id);
      return of({ success: true });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    return this.api.delete(`${this.postsPath()}/${id}`);
  }

  bulkDeletePosts(ids: string[]): Observable<any> {
    if (this.useDummy()) {
      this.dummyPosts = this.dummyPosts.filter((p) => !ids.includes(p.id));
      return of({ success: true });
    }
    return this.api.post(`${this.postsPath()}/actions/bulk-delete`, { ids });
  }

  changePostStatus(id: string, value: boolean): Observable<any> {
    if (this.useDummy()) {
      this.dummyPosts = this.dummyPosts.map((p) =>
        p.id === id ? { ...p, status: value } : p,
      );
      return of({ success: true });
    }
    this.api.setCulture(localStorage.getItem('app_lang') || 'en');
    const fd = new FormData();
    fd.append('status', value ? '1' : '0');
    return this.api.post(`${this.postsPath()}/${id}`, fd);
  }

  /** Category options for post form (dummy reads in-memory categories). */
  getCategoryOptionsForSelect(): { id: string; name: string }[] {
    return this.dummyCategories.map((c) => ({ id: c.id, name: c.name_en }));
  }

  /** Post form: all categories as select options (dummy or API list). */
  getCategoriesForDropdown(): Observable<{ id: string; name: string }[]> {
    if (this.useDummy()) {
      return of(this.getCategoryOptionsForSelect());
    }
    return this.getCategories({ page: 1, size: 500 }, '').pipe(
      map((res: any) =>
        (res.result || []).map((c: BlogCategory) => ({
          id: c.id,
          name: c.name_en || c.name,
        })),
      ),
    );
  }
}
