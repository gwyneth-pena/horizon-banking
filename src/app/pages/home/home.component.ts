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

@Component({
  selector: 'app-home',
  imports: [
    TitleHeaderComponent,
    PlaidLinkComponent,
    TransactionTableComponent,
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
    const transactionFromPlaid: any = await lastValueFrom(
      this.plaidService.getTransactions(await activeBank?.accessToken)
    );
    if (!(await transactionFromPlaid?.transactions)) return [];
    let transactionsFromAppWrite: any = await lastValueFrom(
      of(
        this.appWriteService.getDocument(this.dbId, this.transactionColId, [
          Query.or([
            Query.equal('receiverId', this.user()?.$id),
            Query.equal('senderId', this.user()?.$id),
          ]),
        ])
      )
    );
    transactionsFromAppWrite =
      (await transactionsFromAppWrite?.documents) || [];

    return [
      ...(await transactionsFromAppWrite),
      ...(await transactionFromPlaid?.transactions),
    ].sort(
      (a: any, b: any) =>
        new Date(b?.date).getTime() - new Date(a?.date).getTime()
    );
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
    let banks: any = await lastValueFrom(
      of(
        this.appWriteService.getDocument(this.dbId, this.bankColId, [
          Query.equal('userId', this.user()?.$id),
        ])
      )
    );
    banks = banks?.documents || [];
    banks = Promise.all(
      banks.map(async (bank: any, i: number) => {
        bank.active = false;
        if (i == 0) {
          bank.active = true;
        }

        const accountResponse: any = await lastValueFrom(
          this.plaidService.getAccount(bank.accessToken)
        );

        const nameAbbrev = await accountResponse?.account?.name
          ?.split(' ')
          .map((i: any) => i[0].toUpperCase())
          .splice(0, 2)
          .join('');

        return {
          ...bank,
          ...(await accountResponse?.account),
          nameAbbrev: await nameAbbrev,
        };
      })
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
