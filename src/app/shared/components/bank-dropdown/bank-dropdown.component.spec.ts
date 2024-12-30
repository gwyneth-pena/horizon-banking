import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { BankDropdownComponent } from './bank-dropdown.component';
import { AppWriteService } from '../../services/app-write.service';
import { PlaidService } from '../../services/plaid.service';
import { lastValueFrom, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BankDropdownComponent', () => {
  let component: BankDropdownComponent;
  let fixture: ComponentFixture<BankDropdownComponent>;
  let appwriteService: AppWriteService;
  let plaidService: PlaidService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDropdownComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(BankDropdownComponent);
    appwriteService = TestBed.inject(AppWriteService);
    plaidService = TestBed.inject(PlaidService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show banks in options', fakeAsync(() => {
    spyOn(
      appwriteService,
      'getCurrentUser'
    ).and.returnValue(lastValueFrom(of({ name: 'Gwen Gorobao' })));
    spyOn(appwriteService, 'getDocument').and.returnValue(
      lastValueFrom(
        of({
          total: 1,
          documents: [
            {
              accountId: 'V4798kZpEBunJPa8ze9JhbEXVkaBnEt9lQXvE',
              bankId: 'BPgmzyLwBJc4kjZBXM5kUwxAWkzxjMFwZo4Aq',
              accessToken:
                'access-sandbox-15d3cc04-12f1-4c33-9a1e-5318db7b34e9',
              fundingSourceUrl:
                'https://api-sandbox.dwolla.com/funding-sources/2f4dc995-fab6-4374-a3d4-32988c6a5b79',
              shareableId:
                'VjQ3OThrWnBFQnVuSlBhOHplOUpoYkVYVmthQm5FdDlsUVh2RQ==',
              $id: '67653e78001b37cf1f45',
              $createdAt: '2024-12-20T09:52:57.820+00:00',
              $updatedAt: '2024-12-20T09:52:57.820+00:00',
              $permissions: [
                'read("user:67653e2b002fa13b71dc")',
                'update("user:67653e2b002fa13b71dc")',
                'delete("user:67653e2b002fa13b71dc")',
              ],
              userId: {
                dwollaCustomerId: '95c78f68-e91d-401a-89a1-64124728df97',
                ssn: '1234',
                firstName: 'Gwyneth ',
                lastName: 'Gorobao',
                address1: 'Mahusay',
                email: 'gwenpenadev@gmail.com',
                state: 'NY',
                city: 'New York City',
                postalCode: '20102',
                dateOfBirth: '2000-03-12',
                userId: '67653e2b002fa13b71dc',
                $id: '67653e310000121f6f94',
                $createdAt: '2024-12-20T09:51:46.346+00:00',
                $updatedAt: '2024-12-20T09:51:46.346+00:00',
                $permissions: [
                  'read("user:67653e2b002fa13b71dc")',
                  'update("user:67653e2b002fa13b71dc")',
                  'delete("user:67653e2b002fa13b71dc")',
                ],
                $databaseId: '67516ae9003db24e5da1',
                $collectionId: '67652121001707121287',
              },
              $databaseId: '67516ae9003db24e5da1',
              $collectionId: '676521620005c8fc3dff',
            },
          ],
        })
      )
    );
    spyOn(plaidService, 'getAccount').and.callFake((token: string) => {
      return of({ account: { name: 'Bank' } });
    });

    component.getBanks();
    tick(1000);
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(1);
    expect(options[0].nativeElement.innerHTML).toContain('Bank');
  }));
});
