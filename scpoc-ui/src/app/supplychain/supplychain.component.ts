import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'angular-sweetalert-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-supplychain',
  templateUrl: './supplychain.component.html',
  styleUrls: ['./supplychain.component.css']
})
export class SupplychainComponent implements OnInit {
  assetname;
  status: Boolean;
  transactions;
  qty;
  from;
  to;
  actors;
  constructor(private http: HttpClient, private sweetalert: SweetAlertService) { }

  ngOnInit() {
    
  }

  changeStatus(){
    this.status = false;
    this.status = true;
  }

  fetch(){
    this.status = false;
    this.http.get<any>(`${environment.apihost}/listassettransactions/${this.assetname}`).subscribe(data => {
      this.changeStatus();
      this.transactions = data.tx;
    });
  }

  action(path) {
    this.status = false;
    this.http.get<any>(`${environment.apihost}/${path}/${this.assetname}/${this.qty}`).subscribe(data => {
      console.log(data);
      this.changeStatus();
      this.getTx();
      alert('success');
    }, (err)=>{
      alert('Failed');
    });
  }

  getTx(){
    this.http.get<any>(`${environment.apihost}/listassettransactions/${this.assetname}`).subscribe(data => {
      this.transactions = data.tx;
    });
  }

  send(){
    this.status = false;
    let body = {
      from: this.from,
      to: this.to
    }
    this.http.post<any>(`${environment.apihost}/send/${this.assetname}/${this.qty}`, body).subscribe(data => {
      this.changeStatus();
      this.getTx();
      alert(data.tx);
    }, (err)=>{
      alert('Failed');
    });
  }

  getActors(){
    this.status = false;
    this.http.get<any>(`${environment.apihost}/listactors/${this.assetname}`).subscribe((data)=>{
      this.actors = data.result;
      this.changeStatus();
      this.getTx();
    }, (err)=>{
      alert('Error');
    });
  }
  changeFrom(data){
    this.from = JSON.parse(data).address;
  }
  changeTo(data){
    this.to = JSON.parse(data).address;
  }
}
