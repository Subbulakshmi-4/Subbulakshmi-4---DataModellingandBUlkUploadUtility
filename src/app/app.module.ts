import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EntitylistService } from './Services/entitylist.service';
import { DisplaytableNameComponent } from './displaytable-name/displaytable-name.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './Services/AlertService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputcolumnsComponent } from './ColumnInputs/inputcolumns/inputcolumns.component';


@NgModule({
  declarations: [
    AppComponent,
    DisplaytableNameComponent,
    EntityDetailsComponent,
    InputcolumnsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [EntitylistService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
