import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierListComponent } from './supplier-list.component';
import { SupplierBoxComponent } from './supplier-box/supplier-box.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [SupplierListComponent],
  declarations: [SupplierListComponent, SupplierBoxComponent]
})
export class SupplierListModule { }
