import { TestBed, inject } from '@angular/core/testing';

import { DnDMapService } from './dn-dmap.service';

describe('DnDMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DnDMapService]
    });
  });

  it('should be created', inject([DnDMapService], (service: DnDMapService) => {
    expect(service).toBeTruthy();
  }));
});
