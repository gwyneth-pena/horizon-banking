import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleHeaderComponent } from "../../shared/components/title-header/title-header.component";
import Chart from 'chart.js/auto';
import { PlaidLinkComponent } from '../../shared/components/plaid-link/plaid-link.component';
import { AppWriteService } from '../../shared/services/app-write.service';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';



@Component({
  selector: 'app-home',
  imports: [TitleHeaderComponent, PlaidLinkComponent, NgxPlaidLinkModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  donut: any;
  user: any = signal<any>(undefined);
  appWriteService = inject(AppWriteService);

  async ngOnInit(): Promise<void> {
    this.createChart();
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  createChart() {
    this.donut = new Chart('donut', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: ['#85B7FF', '#4893FF', '#0179FE'],
            hoverOffset: 2,
          },
        ],
      },
      options: {
        aspectRatio: 1.3,
      },
    });
  }
}
