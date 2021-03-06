import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlertService } from 'angular-sweetalert-service';


import { AppComponent } from './app.component';
import { BuysellModule } from './buysell/buysell.module';
import { SupplychainModule } from './supplychain/supplychain.module';
import { ApiService } from './shared/services/api.service';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/supplychain',
    pathMatch: 'full'
  },
  {
    path: "supplychain",
    loadChildren: 'app/supplychain/supplychain.module#SupplychainModule',
    pathMatch: 'full'
  }, 
  {
    path: 'buysell',
    loadChildren: 'app/buysell/buysell.module#BuysellModule',
    pathMatch: 'full'
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
    MyRouter,
    BrowserModule,
    BrowserAnimationsModule,
    BuysellModule,
    SupplychainModule,
    HttpClientModule
  ],
  providers: [SweetAlertService, ApiService], 
  bootstrap: [AppComponent]
})
export class AppModule { }
