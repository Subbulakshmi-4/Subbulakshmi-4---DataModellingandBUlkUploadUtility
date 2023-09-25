import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { TablenamelistComponent } from './tablenamelist/tablenamelist.component';
import { EntityListServiceService } from './entity-list-service.service';

@NgModule({
  declarations: [
    AppComponent,
    TablenamelistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [EntityListServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
