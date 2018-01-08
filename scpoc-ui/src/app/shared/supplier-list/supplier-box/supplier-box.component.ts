import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-supplier-box',
  templateUrl: './supplier-box.component.html',
  styleUrls: ['./supplier-box.component.css']
})
export class SupplierBoxComponent implements OnInit {
  @Input() actor;
  constructor() { }



  ngOnInit() {
  }

}
