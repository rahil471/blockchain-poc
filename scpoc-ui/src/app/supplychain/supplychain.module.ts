import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplychainComponent } from './supplychain.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { SupplierListModule } from '../shared/supplier-list/supplier-list.module';

const SupplychainRoutes: Routes = [
  { 
    path: 'supplychain',  
    children: [{
      path: '', component: SupplychainComponent
    }]
  }
];

export const SupplychainRouting = RouterModule.forChild(SupplychainRoutes);

@NgModule({
  imports: [
    CommonModule,
    SupplychainRouting,
    SupplierListModule,
    FormsModule
  ],
  exports: [RouterModule],
  declarations: [SupplychainComponent]
})
export class SupplychainModule { }
