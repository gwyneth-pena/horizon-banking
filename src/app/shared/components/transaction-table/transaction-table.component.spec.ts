import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTableComponent } from './transaction-table.component';

describe('TransactionTableComponent', () => {
  let component: TransactionTableComponent;
  let fixture: ComponentFixture<TransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show transactions data', () => {
    fixture.componentRef.setInput('transactions', [
      {
        id: 'W39LMyQbDnsgDlMXgdoQfjbp3KVXxEc6jL3eL',
        name: 'Uber 072515 SF**POOL**',
        paymentChannel: 'online',
        type: 'online',
        accountId: 'nvjMDQkNndSo9NJvobl4ivovwKQZLjFA9ypPQ',
        amount: 6.33,
        pending: false,
        category: 'Travel',
        date: '2025-01-02',
        image: 'https://plaid-merchant-logos.plaid.com/uber_1060.png',
        hasMore: false,
      },
    ]);
    fixture.detectChanges();
    const tbody = fixture.debugElement.nativeElement.querySelector('tbody');
    const tr = tbody.querySelectorAll('tr');
    const td = tr[0]?.querySelector('td');
    expect(tr.length).toBe(1);
    expect(component.transactions().length).toBe(1);
    expect(td.innerText).toContain('Uber');
  });

  it('should show 0 transactions', () => {
    fixture.componentRef.setInput('transactions', []);
    fixture.detectChanges();
    const tbody = fixture.debugElement.nativeElement.querySelector('tbody');
    const tr = tbody.querySelectorAll('tr');
    const td = tr[0]?.querySelector('td');

    expect(tr.length).toBe(1);
    expect(component.transactions().length).toBe(0);
  });
});
