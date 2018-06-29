import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
