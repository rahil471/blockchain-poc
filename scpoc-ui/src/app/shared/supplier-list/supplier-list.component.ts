import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnChanges, OnInit {
  @Input() assetname;
  @Input() callapi;
  actors: any;

  constructor(private http: HttpClient) { }

  ngOnChanges(changes) {
    const status: SimpleChange = changes.callapi;
    if(status && status.currentValue == true){
      this.getActors().subscribe(data => {
        console.log(data.result);
        let response = data;
        this.actors = response.result;
      });
    }
  }
  ngOnInit() {
    this.getActors().subscribe(data => {
      console.log(data.result);
      let response = data;
      this.actors = response.result;
    });
  }

  getActors(){
    return this.http.get<ListActorsResponse>(`${environment.apihost}/listactors/${this.assetname}`);
  }

}
interface ListActorsResponse {
  message: String,
  result: Array<any>
}
