import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { TransactionHistoryComponent } from './transaction-history.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from '../../shared/services/utils.service';
import { lastValueFrom, of } from 'rxjs';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let utilsService: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionHistoryComponent,
        RouterModule.forRoot([]),
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    utilsService = TestBed.inject(UtilsService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly slice the transaction data to be shown on transaction table', fakeAsync(() => {
    spyOn(utilsService, 'getBanks').and.returnValue(
      lastValueFrom(of([{ name: 'Bank 1', accountId: '1' }]))
    );
    spyOn(utilsService, 'getTransactions').and.returnValue(
      lastValueFrom(
        of(
          Array.from({ length: 26 }, () => {
            return { name: 'Test Transaction' };
          })
        )
      )
    );

    component.bankId.set('1');
    component.user.set({ name: 'Gwen' });
    component.bank.set(undefined);

    component.newCurrentPage.set(2);

    fixture.detectChanges();

    tick(1000);

    expect(component.bank().name).toBe('Bank 1');
    expect(component.transactions().length).toEqual(26);
    expect(component.currentTransactions().length).toEqual(10);

    component.newCurrentPage.set(2);
    fixture.detectChanges();
    expect(component.currentTransactions().length).toEqual(10);

    component.newCurrentPage.set(3);
    fixture.detectChanges();
    expect(component.currentTransactions().length).toEqual(6);
  }));
});
