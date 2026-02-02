import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTotalComponent } from './card-total.component';

describe('CardTotalComponent', () => {
  let component: CardTotalComponent;
  let fixture: ComponentFixture<CardTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
