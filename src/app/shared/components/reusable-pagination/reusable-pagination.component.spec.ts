import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablePaginationComponent } from './reusable-pagination.component';

describe('ReusablePaginationComponent', () => {
  let component: ReusablePaginationComponent;
  let fixture: ComponentFixture<ReusablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusablePaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
