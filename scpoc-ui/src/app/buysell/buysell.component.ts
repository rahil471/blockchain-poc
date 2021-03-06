import { Component, OnInit } from '@angular/core';
import { TimelineElement } from '../shared/timeline/timeline-elements';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-buysell',
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuysellComponent implements OnInit {
  content = "";
  seller:any = {}; qty; buyer:any = {}; currentDb;
  timeline:TimelineElement[] =  [
    { caption: 'Awaiting', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: "" }
  ]

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getActors();
    this.getBuyer();
    this.getTxDetails();
  }

  getTxDetails(){
    return this.http.get<any>(`${environment.apihost}/currenttransaction`).subscribe(data => {
      
      this.currentDb = data.details;
      if(this.currentDb.milestone.length == 0){
        this.timeline = [{ caption: 'Awaiting', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: "" }];
      } else {
        this.timeline.push(this.currentDb.milestone[this.currentDb.milestone.length -1 ]);
      }
      console.log(data.result);
    });
  }

  getActors(){
    return this.http.get<any>(`${environment.apihost}/seller`).subscribe(data => {
      console.log(data.result);
      let response = data;
      this.seller = response.seller;
    });
  }

  getBuyer(){
    return this.http.get<any>(`${environment.apihost}/buyer`).subscribe(data => {
      console.log(data.result);
      let response = data;
      this.buyer = response.buyer;
    });
  }

  placeOrder(ev, seller){
    let body = {
      "asset1":{
        "addr1": seller.address,
        "name": "LaptopK4",
        "qty": parseInt(this.qty)
      }, 
      "asset2": {
        "name": "$",
        "qty": parseInt(this.qty) * 1000
      }
    }
    this.http.post<any>(`${environment.apihost}/placeorder`, body).subscribe(data=>{
      this.getActors();
      this.getBuyer();
      this.timeline.push(data.timeline[data.timeline.length -1 ]);
      alert('Order Placed');
    });
  }

  doAction(actionname){
    this.http.get<any>(`${environment.apihost}/action/${actionname}`).subscribe(data=>{
      if(actionname == 'deliver'){
        this.qty = 0;
      }
      if(actionname == 'reset'){
        this.timeline = [{ caption: 'Awaiting', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: "" }];
      } else {
        this.timeline = data.timeline;
      }
      this.getActors();
      this.getBuyer();
      alert(this.timeline[this.timeline.length -1].caption);
    });
  }

}

interface ListActorsResponse {
  message: String,
  result: Array<any>
}
