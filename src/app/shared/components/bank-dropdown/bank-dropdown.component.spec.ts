import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { BankDropdownComponent } from './bank-dropdown.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UtilsService } from '../../services/utils.service';
import { lastValueFrom, of } from 'rxjs';

describe('BankDropdownComponent', () => {
  let component: BankDropdownComponent;
  let fixture: ComponentFixture<BankDropdownComponent>;
  let utilsService: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDropdownComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(BankDropdownComponent);
    utilsService = TestBed.inject(UtilsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show banks in options', fakeAsync(() => {
    spyOn(utilsService,'getBanks').and.returnValue(lastValueFrom(of([{name:'Bank'}])));
    component.getBanks();
    tick(1000);
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(1);
    expect(options[0].nativeElement.innerHTML).toContain('Bank');
  }));
});
