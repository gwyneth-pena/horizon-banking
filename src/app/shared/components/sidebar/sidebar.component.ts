import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
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
}
