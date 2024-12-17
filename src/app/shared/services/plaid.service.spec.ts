import { TestBed } from '@angular/core/testing';

import { PlaidService } from './plaid.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlaidService', () => {
  let service: PlaidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(PlaidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
