import { TestBed, inject } from '@angular/core/testing';

import { SquareDetailShareService } from './square-detail-share.service';

describe('SquareDetailShareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SquareDetailShareService]
    });
  });

  it('should be created', inject([SquareDetailShareService], (service: SquareDetailShareService) => {
    expect(service).toBeTruthy();
  }));
});
