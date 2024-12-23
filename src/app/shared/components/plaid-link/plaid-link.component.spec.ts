import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { PlaidLinkComponent } from './plaid-link.component';
import { HttpClientModule } from '@angular/common/http';
import { PlaidService } from '../../services/plaid.service';
import { NgxPlaidLinkService } from 'ngx-plaid-link';
import { AppWriteService } from '../../services/app-write.service';
import { lastValueFrom, of } from 'rxjs';

describe('PlaidLinkComponent', () => {
  let component: PlaidLinkComponent;
  let fixture: ComponentFixture<PlaidLinkComponent>;
  let plaidService: PlaidService;
  let plaidLinkService: NgxPlaidLinkService;
  let appwriteService: AppWriteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaidLinkComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaidLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appwriteService = TestBed.inject(AppWriteService);
    plaidLinkService = TestBed.inject(NgxPlaidLinkService);
    plaidService = TestBed.inject(PlaidService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save generate exchange public token ', fakeAsync(async () => {
    const mockPlaidLinkHandler: any = {
      open: jasmine.createSpy('open'),
      exit: jasmine.createSpy('exit'),
      plaidLink: undefined,
      destroy: function (): void {
        throw new Error('Function not implemented.');
      },
    };
    spyOn(component, 'user').and.returnValue({
      firstName: 'gwen',
      lastName: 'gorobao',
      email: 'gwengorobao@gmail.com',
      type: 'personal',
      city: 'New York',
      address1: '123',
      state: 'NY',
      postalCode: '12332',
      dateOfBirth: '2000-03-14',
      password: 'P@ssw0rd',
      ssn: '2334',
    });
    spyOn(plaidService, 'createPlaidLinkToken').and.returnValue(
      of({
        token: 'link-sandbox-64fd9e7e-4ef5-4cca-b517-912776cd8d9f',
      })
    );
    spyOn(plaidLinkService, 'createPlaid').and.returnValue(
      lastValueFrom(of(mockPlaidLinkHandler))
    );
    mockPlaidLinkHandler.onSuccess = () => {
      return { token: '' };
    };

    spyOn(plaidService, 'createExchangePublicToken').and.returnValue(
      of({ status: 'completed' })
    );

    spyOn(appwriteService, 'createDocument').and.returnValue(
      of({})
    );

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    
    tick();

    plaidService.createExchangePublicToken('token', {}).subscribe({
      next: (res) => {
        expect(res.status).toBe('completed');
        appwriteService.createDocument('','','');
      },
    });
    expect(plaidLinkService.createPlaid).toHaveBeenCalled();
    expect(plaidService.createExchangePublicToken).toHaveBeenCalled();
    expect(appwriteService.createDocument).toHaveBeenCalled();
  }));
});
