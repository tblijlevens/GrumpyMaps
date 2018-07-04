import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import * as $ from 'jquery';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { MapDetailComponent } from './map-detail/map-detail.component';

import {HttpClientModule} from '@angular/common/http';
import { SquareComponent } from './square/square.component';
import { SquareDetailComponent } from './square-detail/square-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    MapDetailComponent,
    SquareComponent,
    SquareDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
