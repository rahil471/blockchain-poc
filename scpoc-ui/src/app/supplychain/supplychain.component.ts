import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'angular-sweetalert-service';

@Component({
  selector: 'app-supplychain',
  templateUrl: './supplychain.component.html',
  styleUrls: ['./supplychain.component.css']
})
export class SupplychainComponent implements OnInit {
  assetname;
  status: Boolean;
  transactions;
  constructor(private http: HttpClient, private sweetalert: SweetAlertService) { }

  ngOnInit() {
  }

  changeStatus(){
    this.status = false;
    this.status = true;
  }

  fetch(){
    this.status = false;
    this.http.get<any>(`http://localhost:3333/listassettransactions/${this.assetname}`).subscribe(data => {
      this.changeStatus();
      this.transactions = data.tx;
    });
  }

  action(path) {
    this.status = false;
    this.http.get<any>(`http://localhost:3333/${path}/${this.assetname}/1000`).subscribe(data => {
      console.log(data);
      this.changeStatus();
      this.getTx();
    });
  }

  getTx(){
    this.http.get<any>(`http://localhost:3333/listassettransactions/${this.assetname}`).subscribe(data => {
      this.transactions = data.tx;
    });
  }
}
