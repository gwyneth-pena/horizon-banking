import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { AppWriteService } from '../../services/app-write.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, RouterModule, NgxSpinnerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  urls = [
    {
      name: 'Home',
      url: '/',
      imgSrc: '/icons/home.svg',
    },
    {
      name: 'My Banks',
      url: '/my-banks',
      imgSrc: '/icons/dollar-circle.svg',
    },
    {
      name: 'Transaction History',
      url: '/transaction-history',
      imgSrc: '/icons/transaction.svg',
    },
    {
      name: 'Payment Transfer',
      url: '/payment-transfer',
      imgSrc: '/icons/money-send.svg',
    },
  ];
  appWriteService = inject(AppWriteService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  user: any;

  async ngOnInit() {
    this.user = await this.appWriteService.getCurrentUser();
  }

  logout() {
    this.spinner.show();
    this.appWriteService.logout().then(() => {
      this.spinner.hide();
      this.router.navigateByUrl('/login');
    }).catch(()=>{
      this.spinner.hide();
    });
  }
}
