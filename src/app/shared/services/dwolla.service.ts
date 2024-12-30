import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DwollaService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  getDwollaToken() {
    return this.http.post('/api/dwolla-token', {});
  }

  postCustomer(user: any, access_token: string) {
    return this.http.post('/api/dwolla-customer', {
      user: user,
      access_token: access_token,
    });
  }

  createTransfer(params: {
    sourceFundingSourceUrl: string;
    destinationFundingSourceUrl: string;
    amount: number;
  }) {
    return this.http.post('/api/create-transfer', params);
  }
}
