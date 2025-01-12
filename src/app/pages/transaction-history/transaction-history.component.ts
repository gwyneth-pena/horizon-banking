import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TitleHeaderComponent } from '../../shared/components/title-header/title-header.component';
import { ActivatedRoute } from '@angular/router';
import { AppWriteService } from '../../shared/services/app-write.service';
import { UtilsService } from '../../shared/services/utils.service';
import { environment } from '../../../environments/environment';
import { PlaidService } from '../../shared/services/plaid.service';
import { PadTwoDecimalPipe } from '../../shared/pipes/pad-two-decimal.pipe';
import { TransactionTableComponent } from '../../shared/components/transaction-table/transaction-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-transaction-history',
  imports: [
    TitleHeaderComponent,
    PadTwoDecimalPipe,
    TransactionTableComponent,
    PaginationComponent,
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  appWriteService = inject(AppWriteService);
  utilsService = inject(UtilsService);
  plaidService = inject(PlaidService);
  bankId = signal('');
  user = signal<any>(undefined);
  bank = signal<any>(undefined);
  transactions = signal<any[]>([]);
  currentTransactions = signal<any>([]);
  dbId = environment.appwriteDatabaseId;
  bankColId = environment.apperiteBanksColId;
  transactionColId = environment.appwriteTransactionsColId;
  currentPage = 1;
  rowsPerPage = 10;
  totalPages = 1;
  indexOfLastTransaction = 1;
  indexOfFirstTransaction = 1;
  newCurrentPage = signal<any>(0);

  constructor() {
    effect(async () => {
      if (this.user() && !this.bank()) {
        const banks = await this.utilsService.getBanks(
          this.user().$id,
          this.dbId,
          this.bankColId
        );

        const bank = await banks.find(
          (bank: any) => bank.accountId == this.bankId()
        );
        this.bank.set(await bank);

        if (!this.bank()) return;

        const transactions = await this.utilsService.getTransactions(
          this.user()?.$id,
          await this.bank().accessToken,
          this.dbId,
          this.transactionColId
        );
        this.transactions.set(transactions);
        this.totalPages = Math.ceil(
          this.transactions().length / this.rowsPerPage
        );
        this.sliceTransactions(this.currentPage);
      }
      if (this.newCurrentPage()) {
        const newCurrentPage = this.newCurrentPage();
        this.currentPage = newCurrentPage;
        this.sliceTransactions(this.currentPage);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.bankId.set(params['id']);
    });
    const user = await this.appWriteService.getCurrentUser();
    this.user.set(user);
  }

  sliceTransactions(currentPage: number) {
    this.indexOfLastTransaction = currentPage * this.rowsPerPage;
    this.indexOfFirstTransaction =
      this.indexOfLastTransaction - this.rowsPerPage;
    const currentTransactions =
      this.transactions()?.slice(
        this.indexOfFirstTransaction,
        this.indexOfLastTransaction
      ) || [];
    this.currentTransactions.set(currentTransactions);
  }
}
