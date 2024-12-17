import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  NgxPlaidLinkService,
  PlaidConfig,
} from 'ngx-plaid-link';

@Injectable({
  providedIn: 'root',
})
export class PlaidService {
  private plaidBackendUrl: string = environment.plaidBackendUrl;
  private http: HttpClient = inject(HttpClient);


  constructor() {}

  createPlaidLinkToken(userId:string, userName:string):Observable<any>{
    return this.http.post<Observable<any>>(this.plaidBackendUrl + '/api/create-plaid-link-token', {$id: userId, name: userName});
  }

  createExchangePublicToken(userId:string, userName:string):Observable<any>{
    return this.http.post<Observable<any>>(this.plaidBackendUrl + '/api/exchange-public-token', {$id: userId, name: userName});
  }


}
