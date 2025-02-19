import { CommonModule } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

let topCategoryStyles: any = {
  'Food and Drink': {
    bg: 'bg-blue-25',
    circleBg: 'bg-blue-100',
    text: {
      main: 'text-blue-900',
      count: 'text-blue-700',
    },
    border: 'border border-blue-700 text-blue-700',
    progress: {
      bg: 'bg-blue-100',
      indicator: 'bg-blue-700',
    },
    icon: '/icons/monitor.svg',
  },
  Travel: {
    bg: 'bg-success-25',
    circleBg: 'bg-success-100',
    text: {
      main: 'text-success-900',
      count: 'text-success-700',
    },
    border: 'border border-success-700 text-success-700',
    progress: {
      bg: 'bg-success-100',
      indicator: 'bg-success-700',
    },
    icon: '/icons/coins.svg',
  },
  default: {
    bg: 'bg-pink-25',
    circleBg: 'bg-pink-100',
    text: {
      main: 'text-pink-900',
      count: 'text-pink-700',
    },
    border: 'border border-pink-700 text-pink-700',
    progress: {
      bg: 'bg-pink-100',
      indicator: 'bg-pink-700',
    },
    icon: '/icons/shopping-bag.svg',
  },
};

export default topCategoryStyles;

@Component({
  selector: 'app-category',
  imports: [CommonModule, ProgressBarComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {

  category: any = input({});
  totalCategories = input(0);

  categoryStyle = topCategoryStyles.default;
  percentage = computed(()=>{
    if(this.category()){
      return (this.category()?.count / this.totalCategories()) * 100;
    }
    return 0;
  });

  constructor() {
    effect(async () => {
      if (await this.category()?.name) {
        this.categoryStyle =
          topCategoryStyles[await this.category()?.name] ||
          topCategoryStyles.default;
      }
    });
  }

  cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
}
