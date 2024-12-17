import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { AppWriteService } from '../shared/services/app-write.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, of } from 'rxjs';
import { DwollaService } from '../shared/services/dwolla.service';
import { HttpClientModule } from '@angular/common/http';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let appWriteService: AppWriteService;
  let dwollaService: DwollaService;
  let router: Router;

  let userSignUpInput = {
    firstName: 'Gwyneth',
    lastName: 'Gorobao',
    email: 'gwenpenadev@gmail.com',
    city: 'New CIty City',
    state: 'NY',
    postalCode: '11101',
    dateOfBirth: '2000-03-12',
    ssn: '1234',
    address1: 'Mahusay',
    password: 'p#ssasdasdas',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'some-param-value' } },
            params: of({ id: '123' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appWriteService = TestBed.inject(AppWriteService);
    dwollaService = TestBed.inject(DwollaService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a message if user already exists', fakeAsync(() => {
    spyOn(appWriteService, 'signUp').and.throwError('User already exists');
    component.form.setValue(userSignUpInput);
    const submitButton = fixture.debugElement.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
    tick(1000);
    fixture.detectChanges();

    const appAlert =
      fixture.debugElement.nativeElement.querySelector('app-alert');
    expect(component.alertData.message.toUpperCase()).toContain('CREATED');
    expect(appAlert).toBeTruthy();
  }));

  it('should show success message and redirect to dashboard if user were able to signup', fakeAsync(() => {
    spyOn(appWriteService, 'signUp').and.returnValue(lastValueFrom(of({})));
    spyOn(appWriteService, 'login').and.returnValue(lastValueFrom(of({})));
    spyOn(dwollaService, 'getDwollaToken').and.returnValue(
      of({ access_token: '232312312' })
    );
    spyOn(dwollaService, 'postCustomer').and.returnValue(
      of({ customer_id: '123123123' })
    );
    spyOn(appWriteService, 'createDocument').and.returnValue(
      lastValueFrom(of({}))
    );
    spyOn(router, 'navigateByUrl');
    component.form.setValue(userSignUpInput);
    const submitButton = fixture.debugElement.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
    tick(1000);
    fixture.detectChanges();

    const appAlert =
      fixture.debugElement.nativeElement.querySelector('app-alert');
    expect(component.alertData.message.toUpperCase()).toContain('SUCCESS');
    expect(appAlert).toBeTruthy();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  }));
});
