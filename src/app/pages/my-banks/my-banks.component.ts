import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TitleHeaderComponent } from '../../shared/components/title-header/title-header.component';
import { AppWriteService } from '../../shared/services/app-write.service';
import { UtilsService } from '../../shared/services/utils.service';
import { environment } from '../../../environments/environment';
import { BankCardComponent } from '../../shared/components/bank-card/bank-card.component';

@Component({
  selector: 'app-my-banks',
  imports: [TitleHeaderComponent, BankCardComponent],
  templateUrl: './my-banks.component.html',
  styleUrl: './my-banks.component.css',
})
export class MyBanksComponent implements OnInit {
  banks = signal<any>(undefined);
  user = signal<any>(undefined);
  appWriteService = inject(AppWriteService);
  utilsService = inject(UtilsService);
  dbId = environment.appwriteDatabaseId;
  bankColId = environment.apperiteBanksColId;

  constructor() {
    effect(async () => {
      if (this.user() && !this.banks()) {
        this.getBanks();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  async getBanks() {
    const banks = await this.utilsService.getBanks(this.user()?.$id, this.dbId, this.bankColId);
    this.banks.set(await banks);
  }
}
