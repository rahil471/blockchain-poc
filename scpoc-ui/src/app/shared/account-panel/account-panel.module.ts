import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPanelComponent } from './account-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [AccountPanelComponent],
  declarations: [AccountPanelComponent]
})
export class AccountPanelModule { }
