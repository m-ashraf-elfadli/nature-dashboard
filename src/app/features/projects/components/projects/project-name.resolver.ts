import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { ProjectsService } from '../../services/projects.service';

@Injectable({ providedIn: 'root' })
export class ProjectNameResolver implements Resolve<string> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id')!;
    return this.projectsService
      .getById(id, 'en')
      .pipe(map((res) => res.result.name));
  }
}
