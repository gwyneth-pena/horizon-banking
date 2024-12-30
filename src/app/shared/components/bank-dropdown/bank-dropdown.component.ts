import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppWriteService } from '../../services/app-write.service';
import { lastValueFrom, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Query } from 'appwrite';
import { PlaidService } from '../../services/plaid.service';

@Component({
  selector: 'app-bank-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-dropdown.component.html',
  styleUrl: './bank-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BankDropdownComponent),
      multi: true,
    },
  ],
})
export class BankDropdownComponent {
  value: any = undefined;
  isInvalidInput = input(false);
  id = input('');
  name = input('');
  banks = signal<any[]>([]);
  appWriteService = inject(AppWriteService);
  user = signal<any>(undefined);
  dbId = environment.appwriteDatabaseId;
  bankColId = environment.apperiteBanksColId;
  plaidService = inject(PlaidService);

  constructor() {
    effect(() => {
      if (this.user()) {
        this.getBanks();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  onChange!: (value: any) => void;
  onTouched!: () => void;

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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

    this.banks.set(await banksPromise);
  }
}
