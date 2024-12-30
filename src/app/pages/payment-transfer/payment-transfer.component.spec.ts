import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PaymentTransferComponent } from './payment-transfer.component';
import { HttpClientModule } from '@angular/common/http';
import { DwollaService } from '../../shared/services/dwolla.service';
import { AppWriteService } from '../../shared/services/app-write.service';
import { lastValueFrom, of } from 'rxjs';

describe('PaymentTransferComponent', () => {
  let component: PaymentTransferComponent;
  let fixture: ComponentFixture<PaymentTransferComponent>;
  let dwollaService: DwollaService;
  let appwriteService: AppWriteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTransferComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTransferComponent);
    dwollaService = TestBed.inject(DwollaService);
    appwriteService = TestBed.inject(AppWriteService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create payment transfer successfully', fakeAsync(() => {
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
    spyOn(appwriteService, 'createDocument').and.returnValue(
      lastValueFrom(of({}))
    );
    spyOn(dwollaService, 'createTransfer').and.returnValue(
      of({
        data: 'https://api-sandbox.dwolla.com/transfers/55f710d3-8ec6-ef11-acd5-02ab38c54207',
      })
    );
    component.form.setValue({
      name: 'Test',
      email: 'gwenpenadev@gmail.com',
      amount: 1,
      senderBank: {
        accountId: 'V4798kZpEBunJPa8ze9JhbEXVkaBnEt9lQXvE',
        bankId: 'BPgmzyLwBJc4kjZBXM5kUwxAWkzxjMFwZo4Aq',
        accessToken: 'access-sandbox-15d3cc04-12f1-4c33-9a1e-5318db7b34e9',
        fundingSourceUrl:
          'https://api-sandbox.dwolla.com/funding-sources/2f4dc995-fab6-4374-a3d4-32988c6a5b79',
        shareableId: 'VjQ3OThrWnBFQnVuSlBhOHplOUpoYkVYVmthQm5FdDlsUVh2RQ==',
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
        active: true,
        id: 'V4798kZpEBunJPa8ze9JhbEXVkaBnEt9lQXvE',
        availableBalance: 100,
        currentBalance: 110,
        institutionId: 'ins_56',
        name: 'Plaid Checking',
        officialName: 'Plaid Gold Standard 0% Interest Checking',
        mask: '0000',
        type: 'depository',
        subtype: 'checking',
        nameAbbrev: 'PC',
      },
    });
    const submitButton = fixture.debugElement.nativeElement.querySelector("button");
    submitButton.click();
    fixture.detectChanges();
    tick(1000);
    expect(component.alertData.type).toBe('success');
  }));
});
