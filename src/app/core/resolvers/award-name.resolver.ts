import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { AwardsService } from '../../services/awards.service';
import { map } from 'rxjs';


export const awardNameResolver: ResolveFn<string> = (route) => {
  const service = inject(AwardsService);

  const id = route.paramMap.get('id')!;
  const lang = localStorage.getItem('app_lang') ?? 'en';

  return service.getById(id, lang).pipe(
    map(res => {
      return res.result.name
    })
  );
};
