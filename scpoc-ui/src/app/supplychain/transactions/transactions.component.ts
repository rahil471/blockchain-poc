import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions:any = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  getTransactions(assetname){
    this.api.getAssetTransactions(assetname).subscribe((data)=>{
      this.transactions = data.tx;
    }, (err)=>{
      alert('error ==>'+ err);
    });
  }
}
