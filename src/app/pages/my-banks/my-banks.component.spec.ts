import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { MyBanksComponent } from './my-banks.component';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from '../../shared/services/utils.service';
import { lastValueFrom, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


describe('MyBanksComponent', () => {
  let component: MyBanksComponent;
  let utilsService: UtilsService;
  let fixture: ComponentFixture<MyBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBanksComponent, HttpClientModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBanksComponent);
    utilsService = TestBed.inject(UtilsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show bank cards', fakeAsync(() => {
    spyOn(utilsService, 'getBanks').and.returnValue(
      lastValueFrom(of([{ name: 'Bank' }]))
    );
    component.getBanks();
    tick(1000);

    fixture.detectChanges();

    const bankCardComponent = fixture.debugElement.query(
      By.css('app-bank-card')
    ).componentInstance;

    expect(bankCardComponent).toBeTruthy();
  }));
});
