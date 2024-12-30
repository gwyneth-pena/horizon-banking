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

@Component({
  selector: 'app-home',
  imports: [
    TitleHeaderComponent,
    PlaidLinkComponent,
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
  user: any = signal<any>(undefined);
  appWriteService = inject(AppWriteService);
  plaidService = inject(PlaidService);
  banks: any = signal<any>(undefined);
  activeBank: any = signal<any>({});
  banksTotalBalance = computed(async () => {
    const banks = this.banks() || [];
    const total = await banks.reduce(
      (acc: number, curr: any) => acc + curr.availableBalance,
      0
    );
    return total;
  });

  constructor() {
    effect(() => {
      if (this.user()) {
        this.getBanks();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.createChart();
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  getRandomHexColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createChart() {
    this.donut = new Chart('donut', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: ['#85B7FF', '#4893FF', '#0179FE'],
            hoverOffset: 2,
          },
        ],
      },
      options: {
        aspectRatio: 1.3,
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
    if(await banksPromise.length > 0){
      await this.setActiveBank(banksPromise[0]);
    }

    this.banks.set(await banksPromise);

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
