import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { UnAuthGuard } from './unauth.guard';

describe('unauthGuard', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(UnAuthGuard).toBeTruthy();
  });
});
