import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { awardNameResolver } from './award-name.resolver';

describe('awardNameResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => awardNameResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
