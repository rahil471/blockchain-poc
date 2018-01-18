import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  getMembers(assetname){
    return this.http.get<any>(`${environment.apihost}/listactors/${assetname}`);
  }

  getMembersWithAllAssets(){
    return this.http.get<any>(`${environment.apihost}/listactors/all`);
  }

  create(assetname, qty){
    return this.http.get<any>(`${environment.apihost}/manufacture/${assetname}/${qty}`);
  }

  send(assetname, qty, body){
    return this.http.post<any>(`${environment.apihost}/send/${assetname}/${qty}`, body);
  }

  getBalance(address){
    return this.http.get<any>(`${environment.apihost}/getbalance/${address}`);
  }

}
