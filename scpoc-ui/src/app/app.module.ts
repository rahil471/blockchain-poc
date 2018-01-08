import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlertService } from 'angular-sweetalert-service';


import { AppComponent } from './app.component';
import { BuysellModule } from './buysell/buysell.module';
import { SupplychainModule } from './supplychain/supplychain.module';


const appRoutes: Routes = [
  {
    path: "supplychain",
    loadChildren: 'app/supplychain/supplychain.module#SupplychainModule'
  }, 
  {
    path: 'buysell',
    loadChildren: 'app/buysell/buysell.module#BuysellModule'
   }
];

const MyRouter = RouterModule.forRoot(
  appRoutes,
  { enableTracing: true } // <-- debugging purposes only
);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BuysellModule,
    SupplychainModule,
    MyRouter,
    HttpClientModule
  ],
  providers: [SweetAlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
