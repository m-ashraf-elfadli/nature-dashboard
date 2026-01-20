import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationTestComponent } from './confirmation-test.component';

describe('ConfirmationTestComponent', () => {
  let component: ConfirmationTestComponent;
  let fixture: ComponentFixture<ConfirmationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
