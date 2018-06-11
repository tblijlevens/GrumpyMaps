import { TestBed, inject } from '@angular/core/testing';

import { MapShareService } from './map-share.service';

describe('mapShareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapShareService]
    });
  });

  it('should be created', inject([MapShareService], (service: MapShareService) => {
    expect(service).toBeTruthy();
  }));
});
