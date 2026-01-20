import { TestBed } from '@angular/core/testing';

import { ConfirmationPopupService } from './confirmation-popup.service';



describe('ConfirmationPopupService', () => {
  let service: ConfirmationPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
