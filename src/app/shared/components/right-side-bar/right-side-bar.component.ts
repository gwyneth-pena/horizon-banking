import { Component, effect, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlaidLinkComponent } from '../plaid-link/plaid-link.component';
import { BankCardComponent } from '../bank-card/bank-card.component';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-right-side-bar',
  imports: [
    RouterModule,
    PlaidLinkComponent,
    BankCardComponent,
    CommonModule,
    CategoryComponent,
  ],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.css',
})
export class RightSideBarComponent {
  user = input<any>(undefined);
  transactions = input<any>([]);
  banks = input([]);
  bankAdded = output();
  categories = signal([]);
  categoriesCount = signal(0);

  constructor() {
    effect(async () => {
      if ((await this.transactions()?.length) > 0) {
        const transactions = await this.transactions();
        let categories = await transactions.reduce((acc: any, curr: any) => {
          if (acc[curr.category]) {
            acc[curr.category] += 1;
          } else {
            acc[curr.category] = 1;
          }
          return acc;
        }, {});
        let sortedCategories:any = [];
        let totalCategories = 0;
        sortedCategories = Object.entries(await categories).map((categories:any)=>{
          totalCategories += categories[1];
          return {name: categories[0], count: categories[1]};
        });
        sortedCategories.sort((a:any,b:any)=>b.count-a.count);

        this.categories.set(await sortedCategories);
        this.categoriesCount.set(totalCategories);
      }
    });
  }
}
