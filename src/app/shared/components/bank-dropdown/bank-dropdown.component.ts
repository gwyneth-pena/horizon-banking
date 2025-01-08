import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../services/utils.service';
import { AppWriteService } from '../../services/app-write.service';

@Component({
  selector: 'app-bank-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-dropdown.component.html',
  styleUrl: './bank-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BankDropdownComponent),
      multi: true,
    },
  ],
})
export class BankDropdownComponent {
  value: any = undefined;
  isInvalidInput = input(false);
  id = input('');
  name = input('');
  banks = signal<any[]>([]);
  appWriteService = inject(AppWriteService);
  user = signal<any>(undefined);
  dbId = environment.appwriteDatabaseId;
  bankColId = environment.apperiteBanksColId;
  utilsService = inject(UtilsService);

  constructor() {
    effect(() => {
      if (this.user()) {
        this.getBanks();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user.set(await this.appWriteService.getCurrentUser());
  }

  onChange!: (value: any) => void;
  onTouched!: () => void;

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  async getBanks() {
    const banks = await this.utilsService.getBanks(
      this.user()?.$id,
      this.dbId,
      this.bankColId
    );
    this.banks.set(await banks);
  }
}
