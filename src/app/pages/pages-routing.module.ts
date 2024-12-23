import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PaymentTransferComponent } from './payment-transfer/payment-transfer.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: HomeComponent,
  },{
    path: 'payment-transfer',
    component: PaymentTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
