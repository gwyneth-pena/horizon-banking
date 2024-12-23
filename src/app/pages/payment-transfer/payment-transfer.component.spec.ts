import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransferComponent } from './payment-transfer.component';

describe('PaymentTransferComponent', () => {
  let component: PaymentTransferComponent;
  let fixture: ComponentFixture<PaymentTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
