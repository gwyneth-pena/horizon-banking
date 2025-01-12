import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  totalPages = input(0);
  pages = signal<any[]>([]);
  page = input(0);
  currentPage = signal(1);
  newCurrentPage = output<number>();

  constructor() {
    effect(() => {
      if (this.totalPages()) {
        const pages = Array.from(
          { length: this.totalPages() },
          (_, i) => i + 1
        );
        this.pages.set(pages);
        if (pages.length > 1) this.currentPage.set(1);
      }
    });
  }

  handleClick(newPage:number){
    this.currentPage.set(newPage);
    this.newCurrentPage.emit(this.currentPage());
  }
}
