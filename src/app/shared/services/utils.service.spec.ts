import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { HttpClientModule } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { PlaidService } from './plaid.service';
import { AppWriteService } from './app-write.service';

describe('UtilsService', () => {
  let service: UtilsService;
  let plaidService: PlaidService;
  let appWriteService: AppWriteService;
  let documentAccountValue = {
    total: 1,
    documents: [
      {
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
      },
    ],
  };
  let documentTransactionValue = {
    total: 1,
    documents: [
      {
        name: 'Test 2',
        amount: 300,
        categpry: 'Payment',
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
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(UtilsService);
    plaidService = TestBed.inject(PlaidService);
    appWriteService = TestBed.inject(AppWriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBanks() should return banks', fakeAsync(async () => {
    spyOn(appWriteService, 'getCurrentUser').and.returnValue(
      lastValueFrom(of({ name: 'Gwen Gorobao' }))
    );
    spyOn(appWriteService, 'getDocument').and.returnValue(
      lastValueFrom(of(documentAccountValue))
    );
    spyOn(plaidService, 'getAccount').and.callFake((token: string) => {
      return of({ account: { name: 'Bank' } });
    });

    const data = await service.getBanks('123', 'dbID', 'bankCollectionId');
    tick(1000);
    expect(data.length).toBe(1);
    expect(data[0].name).toBe('Bank');
  }));

  it('getTransactions() should return transactions', fakeAsync(async () => {
    spyOn(plaidService, 'getTransactions').and.returnValue(
      of({
        transactions: [
          { name: 'transaction', category: 'Payment', amount: 100 },
        ],
      })
    );

    spyOn(appWriteService, 'getDocument').and.returnValue(
      lastValueFrom(of(documentTransactionValue))
    );

    const data = await service.getTransactions(
      '123',
      '2345',
      'dbID',
      'transactionCollectionId'
    );
    tick(1000);
    expect(data.length).toBe(2);
  }));
});
