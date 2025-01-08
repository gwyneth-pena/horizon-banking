import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { PadTwoDecimalPipe } from '../../pipes/pad-two-decimal.pipe';
import { RemoveUnwantedCharsPipe } from '../../pipes/remove-unwanted-chars.pipe';

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule, PadTwoDecimalPipe, RemoveUnwantedCharsPipe],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent {
  transactions: any = input([]);
}
