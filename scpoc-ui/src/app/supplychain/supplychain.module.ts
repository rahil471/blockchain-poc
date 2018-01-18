import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplychainComponent } from './supplychain.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { SupplierListModule } from '../shared/supplier-list/supplier-list.module';
import { MembersListComponent } from './members-list/members-list.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';

const SupplychainRoutes: Routes = [
  { 
    path: 'supplychain',  
    children: [
      { path: '', component: SupplychainComponent, 
        children: [
        {  path: '', redirectTo: '/supplychain/members', pathMatch:'full' },
        {  path: 'members', component: MembersListComponent, pathMatch:'full' },
        {  path: 'inventory', component: InventoryComponent, pathMatch:'full' },
        {  path: 'inventory/:seller', component: InventoryComponent, pathMatch:'full' },
        {  path: 'transactions', component: TransactionsComponent, pathMatch:'full' }
      ] 
    },
      
  ]
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
  declarations: [SupplychainComponent, MembersListComponent, InventoryComponent, TransactionsComponent]
})
export class SupplychainModule { }
