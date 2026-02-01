import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { ServicesService } from '../../services/services.service';

@Injectable({ providedIn: 'root' })
export class ServiceNameResolver implements Resolve<string> {
  constructor(private servicesService: ServicesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id')!;
    return this.servicesService
      .getServiceById(id)
      .pipe(map((res) => res.result.name));
  }
}
