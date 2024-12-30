import { Component, inject } from '@angular/core';
import { TitleHeaderComponent } from '../../shared/components/title-header/title-header.component';
import { BankDropdownComponent } from '../../shared/components/bank-dropdown/bank-dropdown.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppWriteService } from '../../shared/services/app-write.service';
import { environment } from '../../../environments/environment';
import { Query } from 'appwrite';
import { lastValueFrom, of } from 'rxjs';
import { DwollaService } from '../../shared/services/dwolla.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-payment-transfer',
  imports: [
    TitleHeaderComponent,
    BankDropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AlertComponent,
  ],
  templateUrl: './payment-transfer.component.html',
  styleUrl: './payment-transfer.component.css',
})
export class PaymentTransferComponent {
  formBuilder = inject(FormBuilder);
  submittedForm: boolean = false;
  spinner = inject(NgxSpinnerService);
  appWriteService = inject(AppWriteService);
  dwollaService = inject(DwollaService);
  alertData = {
    message: '',
    type: '',
  };

  form: any = this.formBuilder.group({
    senderBank: [null, Validators.required],
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    amount: ['', Validators.required],
  });
  

  async submit() {
    this.submittedForm = true;
    if (this.form.valid) {
      try {
        this.spinner.show();
        const bankDBCol = environment.apperiteBanksColId;
        const userDBCol = environment.appwriteUsersColId;
        const dbId = environment.appwriteDatabaseId;
        let receiverUser: any = await lastValueFrom(
          of(
            this.appWriteService.getDocument(dbId, userDBCol, [
              Query.equal('email', this.form.value.email || ''),
            ])
          )
        );

        receiverUser = await receiverUser?.documents;
        receiverUser = await receiverUser[0];

        if (!await receiverUser) {
          this.spinner.hide();
          this.alertData.type = 'danger';
          this.alertData.message = 'Something went wrong.';
          return;
        }

        let receiverBank: any = await lastValueFrom(
          of(
            this.appWriteService.getDocument(dbId, bankDBCol, [
              Query.equal('userId', await receiverUser.$id || ''),
            ])
          )
        );


        receiverBank = await receiverBank.documents;
        receiverBank = await receiverBank?.[0];

        if (!await receiverBank) {
          this.spinner.hide();
          this.alertData.type = 'danger';
          this.alertData.message = 'Something went wrong.';
          return;
        }

        const sourceFundingSourceUrl: any = this.form.value.senderBank;

        const transferParams = {
          sourceFundingSourceUrl: sourceFundingSourceUrl.fundingSourceUrl,
          destinationFundingSourceUrl: await receiverBank?.['fundingSourceUrl'],
          amount: parseFloat(this.form.value.amount || '0'),
        };

        const dwollaResponse: any = await lastValueFrom(
          of(this.dwollaService.createTransfer(transferParams).subscribe())
        );

        if (await dwollaResponse?.message) {
          this.spinner.hide();
          this.alertData.type = 'danger';
          this.alertData.message = 'Something went wrong.';
          return;
        }

        const senderBank: any = this.form.value.senderBank;
        const transaction = {
          name: this.form.value.name,
          amount: this.form.value.amount?.toString(),
          senderId: senderBank?.userId.$id,
          senderBankId: senderBank?.$id,
          receiverId: receiverBank?.$id,
          receiverBankId: receiverBank?.$id,
          email: this.form.value.email,
          channel: 'online',
          category: 'Transfer',
        };
        const transactionColId = environment.appwriteTransactionsColId;
        const transactionCreated = await this.appWriteService.createDocument(
          dbId,
          transactionColId,
          transaction
        );
        if (transactionCreated) {
          this.alertData.message = `$${this.form.value.amount} has been transfered successfully to ${this.form.value.email}.`;
          this.alertData.type = 'success';
          this.submittedForm = false;
          this.form.reset();
          this.spinner.hide();
        }
      } catch (e) {
        this.spinner.hide();
        this.alertData.type = 'danger';
        this.alertData.message = 'Something went wrong.';
      }
    }
  }
}
