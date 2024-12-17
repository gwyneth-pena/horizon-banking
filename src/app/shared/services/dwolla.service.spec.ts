import { TestBed } from '@angular/core/testing';

import { DwollaService } from './dwolla.service';
import { HttpClientModule } from '@angular/common/http';

describe('DwollaService', () => {
  let service: DwollaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(DwollaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
