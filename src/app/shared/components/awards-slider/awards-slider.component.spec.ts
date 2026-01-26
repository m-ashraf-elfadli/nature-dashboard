import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsSliderComponent } from './awards-slider.component';

describe('AwardsSliderComponent', () => {
  let component: AwardsSliderComponent;
  let fixture: ComponentFixture<AwardsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardsSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
