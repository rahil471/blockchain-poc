import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  list:any = [];
  assetname;
  qty;
  senderAddress;
  sender:any = {};
  constructor(private api: ApiService, private activeRoute: ActivatedRoute) { }

  load(){
    this.api.getMembersWithAllAssets().subscribe(data => {
      let response = data;
      this.list = response.result;
    }, (err)=>{
      alert(err);
    });

    this.activeRoute.params.subscribe((params)=>{
      this.senderAddress = params.seller;
      this.api.getBalance(this.senderAddress).subscribe((data)=>{
        this.sender = data.result;
      }, (err)=>{
        alert('Failed');
      });
    });
  }

  ngOnInit() {
    this.load();
  }

  action(path) {
    this.api.create(this.assetname, this.qty).subscribe(data => {
      this.load();
      console.log(data);
      alert('success');
    }, (err)=>{
      alert('Failed');
    });
  }

  send(to, assetname, qty){
    let body = {
      from: this.senderAddress,
      to: to
    }

    this.api.send(assetname, qty, body).subscribe(data => {
      this.load();
      alert(data.tx);
    }, (err)=>{
      alert('Failed');
    })
  }



}
