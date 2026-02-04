import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { ProjectsService } from '../../services/projects.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ProjectNameResolver implements Resolve<string> {
  private projectsService = inject(ProjectsService);
  private translate = inject(TranslateService);

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id')!;
    // Use current language from TranslateService instead of hardcoded 'en'
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang || 'en';

    return this.projectsService
      .getById(id, localStorage.getItem('app_lang') || 'en')
      .pipe(map((res) => res.result.name));
  }
}
