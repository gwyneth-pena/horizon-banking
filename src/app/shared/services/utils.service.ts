import { inject, Injectable } from '@angular/core';
import { AppWriteService } from './app-write.service';
import { lastValueFrom, of } from 'rxjs';
import { PlaidService } from './plaid.service';
import { Query } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  appWriteService: any = inject(AppWriteService);
  plaidService: any = inject(PlaidService);

  constructor() {}

  async getBanks(
    userId: string,
    dbId: string,
    bankColId: string
  ): Promise<any> {
    let banks: any = await lastValueFrom(
      of(
        this.appWriteService.getDocument(dbId, bankColId, [
          Query.equal('userId', userId),
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
    return await banksPromise;
  }
}
