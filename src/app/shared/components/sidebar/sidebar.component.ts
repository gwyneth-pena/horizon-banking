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
  router = inject(Router);
  urls = [
    {
      name: 'Home',
      url: '/dashboard',
      imgSrc: '/icons/home.svg',
      isActive: true,
    },
    {
      name: 'My Banks',
      url: '/my-banks',
      imgSrc: '/icons/dollar-circle.svg',
      isActive: false,
    },
    {
      name: 'Transaction History',
      url: '/transaction-history',
      imgSrc: '/icons/transaction.svg',
      isActive: false,
    },
    {
      name: 'Payment Transfer',
      url: '/payment-transfer',
      imgSrc: '/icons/money-send.svg',
      isActive: false,
    },
  ];
  appWriteService = inject(AppWriteService);
  spinner = inject(NgxSpinnerService);
  user: any;

  async ngOnInit() {
    this.user = await this.appWriteService.getCurrentUser();
  }

  logout() {
    this.spinner.show();
    this.appWriteService
      .logout()
      .then(() => {
        this.spinner.hide();
        this.router.navigateByUrl('/login');
      })
      .catch(() => {
        this.spinner.hide();
      });
  }

  setIsActiveUrl() {
    this.urls = this.urls.map((u: any) => {
      console.log(u.url, this.router.url);
      if (u.url !== this.router.url) {
        u.isActive = false;
      } else {
        u.isActive = true;
      }
      return u;
    });
  }
}
