import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuysellComponent } from './buysell.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { TimelineModule } from '../shared/timeline/timeline.module';
import { SupplierListModule } from '../shared/supplier-list/supplier-list.module';
import { AccountPanelModule } from '../shared/account-panel/account-panel.module';

const BuysellRoutes: Routes = [
  { path: '',  component: BuysellComponent }
];

export const BuysellRouting = RouterModule.forChild(BuysellRoutes);

@NgModule({
  imports: [
    CommonModule,
    BuysellRouting,
    TimelineModule,
    SupplierListModule,
    AccountPanelModule,
    FormsModule
  ],
  exports: [RouterModule],
  declarations: [BuysellComponent]
})
export class BuysellModule { }
