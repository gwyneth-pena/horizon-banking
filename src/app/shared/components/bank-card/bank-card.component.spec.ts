import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCardComponent } from './bank-card.component';
import { RouterModule } from '@angular/router';

describe('BankCardComponent', () => {
  let component: BankCardComponent;
  let fixture: ComponentFixture<BankCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankCardComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BankCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
