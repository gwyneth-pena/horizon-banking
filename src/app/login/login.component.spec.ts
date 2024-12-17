import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, of } from 'rxjs';
import { AppWriteService } from '../shared/services/app-write.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let appWriteService: AppWriteService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    appWriteService = TestBed.inject(AppWriteService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show invalid credentials message if invalid credentials', fakeAsync(() => {
    spyOn(appWriteService, 'login').and.throwError('Invalid credentials');
    component.form.setValue({
      email: 'gwenpenadev@gmail.com',
      password: 'P@ssw0rd',
    });

    const submitBtn = fixture.debugElement.nativeElement.querySelector(
      'button[type="submit"]'
    );

    submitBtn.click();
    tick(1000);
    fixture.detectChanges();

    const alertComponent =
      fixture.debugElement.nativeElement.querySelector('app-alert');

    expect(component.alertData.type.toLocaleLowerCase()).toContain('danger');
    expect(alertComponent).toBeTruthy();
    expect(alertComponent.innerText).toMatch(/invalid/i);
  }));

  it('should show valid credentials message and redirect to dashboard if invalid credentials', fakeAsync(() => {
    spyOn(appWriteService, 'login').and.returnValue(lastValueFrom(of({})));
    spyOn(router, 'navigateByUrl');
    component.form.setValue({
      email: 'gwenpenadev@gmail.com',
      password: 'P@ssw0rd',
    });

    const submitBtn = fixture.debugElement.nativeElement.querySelector(
      'button[type="submit"]'
    );

    submitBtn.click();
    tick(1000);
    fixture.detectChanges();

    const alertComponent =
      fixture.debugElement.nativeElement.querySelector('app-alert');

    expect(component.alertData.type.toLocaleLowerCase()).toContain('success');
    expect(alertComponent).toBeTruthy();
    expect(alertComponent.innerText).toMatch(/success/i);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  }));
});
