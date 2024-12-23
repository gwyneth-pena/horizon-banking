import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, InputSignal, output } from '@angular/core';
import { PlaidService } from '../../services/plaid.service';
import { NgxPlaidLinkService, PlaidLinkHandler } from 'ngx-plaid-link';
import { environment } from '../../../../environments/environment';
import { AppWriteService } from '../../services/app-write.service';

@Component({
  selector: 'app-plaid-link',
  imports: [CommonModule],
  templateUrl: './plaid-link.component.html',
  styleUrl: './plaid-link.component.css',
})
export class PlaidLinkComponent {
  color: InputSignal<string> = input('');
  user = input();
  bankAdded = output();

  private plaidService = inject(PlaidService);
  private plaidLinkService = inject(NgxPlaidLinkService);
  private plaidLinkHandler: PlaidLinkHandler | undefined;
  private appwriteService = inject(AppWriteService);

  plaidPublicToken: string = '';

  private config: any = {
    apiVersion: 'v2',
    env: 'sandbox',
    institution: null,
    selectAccount: false,
    token: '',
    webhook: '',
    product: environment.plaidProducts,
    countryCodes: ['US', 'CA', 'GB'],
    key: 'YOURPUBLICKEY',
  };

  constructor() {
    effect(() => {
      if (this.user()) {
        const user: any = this.user();
        this.plaidService.createPlaidLinkToken(user.$id, user.name).subscribe({
          next: (res: any) => {
            this.plaidPublicToken = res.token;
          },
        });
      }
    });
  }

  initializePlaidLink(linkToken: string): void {
    this.config.token = linkToken;
    this.config.key = linkToken;
    this.plaidLinkService
      .createPlaid(
        Object.assign({}, this.config, {
          onSuccess: (token: any, metadata: any) => {
            const user: any = this.user();
            this.plaidService
              .createExchangePublicToken(token, user)
              .subscribe({
                next: async (response) => {
                  if (await response.status == 'completed') {
                    await this.appwriteService.createDocument(
                      environment.appwriteDatabaseId,
                      environment.apperiteBanksColId,
                      await response.bankAccountData
                    );
                    this.bankAdded.emit();
                  }
                },
              });
          },
          onExit: (error: any, metadata: any) => {},
          onEvent: (eventName: any, metadata: any) => {},
        })
      )
      .then((handler: PlaidLinkHandler) => {
        this.plaidLinkHandler = handler;
        this.open();
      });
  }

  open() {
    this.plaidLinkHandler?.open();
  }
}
