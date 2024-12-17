import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title-header',
  imports: [],
  templateUrl: './title-header.component.html',
  styleUrl: './title-header.component.css'
})
export class TitleHeaderComponent {
  titleHTML = input<string>('');
  desc = input<string>('');
}
