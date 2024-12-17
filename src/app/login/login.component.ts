import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AppWriteService } from '../shared/services/app-write.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private formBuilder = inject(FormBuilder);
  private appWriteService = inject(AppWriteService);
  private ngxSpinner = inject(NgxSpinnerService);
  private router = inject(Router);

  submittedForm: boolean = false;
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  alertData = {
    message: '',
    type: '',
  };

  constructor() {
    this.titleService.setTitle('Login | Horizon');
    this.metaService.updateTag({
      name: 'description',
      content: 'Login to Horizon to enjoy seamless banking.',
    });
  }

  async login() {
    this.submittedForm = true;
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.ngxSpinner.show();
      try {
        const session = await this.appWriteService.login(email, password);
        if (session) {
          this.ngxSpinner.hide();
          this.alertData = {
            type: 'success',
            message: 'Login success.',
          };
          this.router.navigateByUrl('/dashboard');
        }
      } catch (e: any) {
        this.ngxSpinner.hide();
        this.alertData = {
          type: 'danger',
          message: 'Invalid credentials.',
        };
      }
    }
  }
}
