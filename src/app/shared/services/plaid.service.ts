import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  createExchangePublicToken(publicToken: string, user: any):Observable<any>{
    return this.http.post<Observable<any>>(this.plaidBackendUrl + '/api/exchange-public-token', {publicToken: publicToken, user:user});
  }

  getAccount(bankToken: string):Observable<any>{
    const params = new HttpParams().set('bankToken', bankToken);
    return this.http.get<any>(this.plaidBackendUrl+'/api/accounts', {params});
  }


}
