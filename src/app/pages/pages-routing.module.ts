import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PaymentTransferComponent } from './payment-transfer/payment-transfer.component';
import { MyBanksComponent } from './my-banks/my-banks.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: HomeComponent,
  },
  {
    path: 'payment-transfer',
    component: PaymentTransferComponent,
  },
  {
    path: 'my-banks',
    component: MyBanksComponent,
  },
  { path: 'transaction-history', component: TransactionHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
