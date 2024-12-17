import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppWriteService } from '../shared/services/app-write.service';
import { environment } from '../../environments/environment';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { DwollaService } from '../shared/services/dwolla.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, NgClass, ReactiveFormsModule, AlertComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private metaService = inject(Meta);
  private titleService = inject(Title);
  private ngxSpinner = inject(NgxSpinnerService);
  private appWriteService = inject(AppWriteService);
  private dwollaService = inject(DwollaService);
  private router = inject(Router);

  submittedForm: boolean = false;
  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: ['', [Validators.required, Validators.minLength(4)]],
    state: [
      '',
      [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
    ],
    postalCode: [
      '',
      [Validators.required, Validators.maxLength(5), Validators.minLength(5)],
    ],
    dateOfBirth: ['', [Validators.required, this.maxYearValidator(new Date().getFullYear())]],
    ssn: [
      '',
      [Validators.required, Validators.maxLength(4), Validators.minLength(4)],
    ],
    password: ['', Validators.required],
    address1: ['', Validators.required],
  });
  alertData = {
    message: '',
    type: '',
  };

  constructor() {
    this.titleService.setTitle('Sign Up | Horizon');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Sign up on Horizon banking app to experience one of the best banking services.',
    });
  }

  async createDwollaCustomer(newCustomer: any) {
    const tokenResponse: any = await lastValueFrom(
      this.dwollaService.getDwollaToken()
    );
    if (await tokenResponse?.access_token) {
      const customerResponse: any = await lastValueFrom(
        this.dwollaService.postCustomer(
          { type: 'personal', ...newCustomer },
          tokenResponse.access_token
        )
      );
      if (await customerResponse?.customer_id) {
        return customerResponse?.customer_id;
      }
    }
    return undefined;
  }

  maxYearValidator(maxYear: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      if (date.getFullYear() > maxYear) {
        return { maxYear: true };
      }
      return null;
    };
  }
  async submit() {
    this.submittedForm = true;
    if (this.form.valid) {
      this.ngxSpinner.show();
      const userCollectionId = environment.appwriteUsersColId;
      const databaseId = environment.appwriteDatabaseId;
      const { email, password, firstName, lastName } = this.form.value;

      try {
        const authUser = await this.appWriteService.signUp(
          email || '',
          password || '',
          `${firstName} ${lastName}`
        );

        if (authUser) {
          const user = await this.appWriteService.login(
            email || '',
            password || ''
          );
          if (user) {
            const dwollaCustomerId = await this.createDwollaCustomer(
              this.form.value
            );

            const data = await this.appWriteService.createDocument(
              databaseId,
              userCollectionId,
              {
                ...this.form.value,
                userId: user.$id,
                dwollaCustomerId: dwollaCustomerId,
              }
            );

            if (data) {
              this.ngxSpinner.hide();
              this.form.reset();
              this.submittedForm = false;
              this.alertData = {
                message: 'Sign up successful.',
                type: 'success',
              };
              this.router.navigateByUrl('/dashboard');
            }
          }
        }
      } catch (e: any) {
        if (e.message?.includes('exist')) {
          this.alertData = {
            message: 'User is already created.',
            type: 'danger',
          };
        }
        this.ngxSpinner.hide();
      }
    }
  }
}
