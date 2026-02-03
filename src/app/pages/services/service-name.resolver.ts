import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { ServicesService } from '../../services/services.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ServiceNameResolver implements Resolve<string> {
  private servicesService = inject(ServicesService);
  private translate = inject(TranslateService);

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id')!;
    // Use current language from TranslateService instead of hardcoded 'en'
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang || 'en';

    return this.servicesService
      .getServiceById(id, currentLang)
      .pipe(map((res) => res.result.name));
  }
}
