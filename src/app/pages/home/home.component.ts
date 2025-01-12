import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TitleHeaderComponent } from '../../shared/components/title-header/title-header.component';
import Chart from 'chart.js/auto';
import { PlaidLinkComponent } from '../../shared/components/plaid-link/plaid-link.component';
import { AppWriteService } from '../../shared/services/app-write.service';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { environment } from '../../../environments/environment';
import { Query } from 'appwrite';
import { lastValueFrom, of } from 'rxjs';
import { PlaidService } from '../../shared/services/plaid.service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TransactionTableComponent } from '../../shared/components/transaction-table/transaction-table.component';
import { RightSideBarComponent } from '../../shared/components/right-side-bar/right-side-bar.component';
import topCategoryStyles from '../../shared/components/category/category.component';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-home',
  imports: [
    TitleHeaderComponent,
    PlaidLinkComponent,
    TransactionTableComponent,
    RightSideBarComponent,
    NgxPlaidLinkModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  donut: any;
  dbId = environment.appwriteDatabaseId;
  bankColId = environment.apperiteBanksColId;
  transactionColId = environment.appwriteTransactionsColId;
  titleService = inject(Title);
  utilsService = inject(UtilsService);
  user: any = signal<any>(undefined);
  appWriteService = inject(AppWriteService);
  plaidService = inject(PlaidService);
  banks: any = signal<any>(undefined);
  activeBank: any = signal<any>({});
  balances: any = computed(() => {
    const banks = this.banks();
    const balances = banks.map((bank: any) => bank.currentBalance);
    return balances;
  });
  accountNames: any = computed(() => {
    const banks = this.banks();
    const accountNames = banks.map((bank: any) => bank.name);
    return accountNames;
  });
  banksTotalBalance = computed(async () => {
    const banks = this.banks() || [];
    const total = await banks.reduce(
      (acc: number, curr: any) => acc + curr.currentBalance,
      0
    );
    return total;
  });

  transactions = computed(async () => {
    const activeBank = await this.activeBank();
    if (!(await activeBank?.accessToken) || !(await activeBank)) return [];
    const transactions = await this.utilsService.getTransactions(
      this.user()?.$id,
      await activeBank.accessToken,
      this.dbId,
      this.transactionColId
    );
    return transactions.splice(0,5);
  });

  constructor() {
    this.titleService.setTitle('Dashboard | Horizon');

    effect(async () => {
      if (this.user() && !this.banks()) {
        this.getBanks();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  createChart() {
    this.donut = undefined;
    const balances = this.balances();
    const accountNames = this.accountNames();
    this.donut = new Chart('donut', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: balances,
            backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
            hoverOffset: 2,
          },
        ],
        labels: accountNames,
      },
      options: {
        aspectRatio: 1.3,
        cutout: '60%',
      },
    });
  }

  async getBanks() {
    const banks = await this.utilsService.getBanks(
      this.user()?.$id,
      this.dbId,
      this.bankColId
    );
    const banksPromise = await banks;
    if ((await banksPromise?.length) > 0) {
      await this.setActiveBank(banksPromise[0]);
    }

    this.banks.set(await banksPromise);
    if (await banksPromise) this.createChart();

    console.log(this.banks());
  }

  async setActiveBank(bank: any) {
    bank.active = true;
    this.activeBank.set(bank);
    let banks = this.banks() || [];
    banks = await banks.map((bankItem: any) => {
      const activeBank = this.activeBank();
      if (bankItem.id !== activeBank.id) {
        bankItem.active = false;
      }
      return { ...bankItem };
    });
    this.banks.set(await banks);
  }
}
