import { Component, OnInit } from '@angular/core';
import { TimelineElement } from '../shared/timeline/timeline-elements';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buysell',
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuysellComponent implements OnInit {
  content = "";
  sellers; qty; buyer;
  timeline:TimelineElement[] =  [
    { caption: 'Order Placed', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: this.content },
    { caption: 'Packaged', date: new Date(2014, 1, 17), title: 'Event title here', content: this.content },
    { caption: 'Shipped', date: new Date(2014, 1, 18), title: 'Event title here', content: this.content },
    { caption: 'Delivered', date: new Date(2014, 1, 19), title: 'Event title here', content: this.content }
  ]

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getActors();
    this.getBuyer();
  }

  getActors(){
    return this.http.get<ListActorsResponse>(`http://localhost:3333/listactors/LaptopK4`).subscribe(data => {
      console.log(data.result);
      let response = data;
      this.sellers = response.result;
    });;
  }

  getBuyer(){
    return this.http.get<ListActorsResponse>(`http://localhost:3333/listactors/Rs?isSeller=true`).subscribe(data => {
      console.log(data.result);
      let response = data;
      this.buyer = response.result;
    });;
  }

  placeOrder(ev, seller){
    console.log(ev);
    let body = {
      "asset1":{
        "addr1": seller.address,
        "name": "LaptopK4",
        "qty": parseInt(this.qty)
      }, 
      "asset2": {
        "name": "Rs",
        "qty": this.qty * 30000
      }
    }
    this.http.post<any>(`http://localhost:3333/placeorder`, body).subscribe(data=>{
      this.getActors();
      getBuyer()
      alert('Order Placed');
    });
  }

}

interface ListActorsResponse {
  message: String,
  result: Array<any>
}
