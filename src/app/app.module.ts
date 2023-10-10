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
import { CreateEntityComponent } from './create-entity/create-entity.component';


@NgModule({
  declarations: [
    AppComponent,
    DisplaytableNameComponent,
    EntityDetailsComponent,
    CreateEntityComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000, // Duration of the toastr notification (in milliseconds)
      positionClass: 'toast-top-right', // Position of the toastr notification
      preventDuplicates: true, // Prevent duplicate notifications
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
