import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PadTwoDecimalPipe } from '../../pipes/pad-two-decimal.pipe';

@Component({
  selector: 'app-bank-card',
  imports: [CommonModule, RouterModule, PadTwoDecimalPipe],
  templateUrl: './bank-card.component.html',
  styleUrl: './bank-card.component.css'
})
export class BankCardComponent {
  account:any = input<any>(undefined);
  username:any = input('');
  showBalance: any = input(true);
}
