import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateActionComponent } from './empty-state-action.component';

describe('EmptyStateActionComponent', () => {
  let component: EmptyStateActionComponent;
  let fixture: ComponentFixture<EmptyStateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
