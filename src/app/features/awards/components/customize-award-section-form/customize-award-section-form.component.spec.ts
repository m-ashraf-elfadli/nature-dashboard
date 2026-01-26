import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeAwardSectionFormComponent } from './customize-award-section-form.component';

describe('CustomizeAwardSectionFormComponent', () => {
  let component: CustomizeAwardSectionFormComponent;
  let fixture: ComponentFixture<CustomizeAwardSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeAwardSectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeAwardSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
