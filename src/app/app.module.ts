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
import { ServerConfigurationComponent } from './server-configuration/server-configuration.component';
import { ColumnInputServiceService } from './Services/column-input-service.service';
import { TableListComponent } from './table-list/table-list.component';
import { ServerConfigService } from '../app/Services/server-config.service';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { ToastrService } from './Services/ToastrService';

@NgModule({
  declarations: [
    AppComponent,
    DisplaytableNameComponent,
    EntityDetailsComponent,
    InputcolumnsComponent,
    ServerConfigurationComponent,
    TableListComponent,
    CreateEntityComponent,
    LogDetailsComponent,
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
  bootstrap: [AppComponent,ToastrService,ColumnInputServiceService]
})
export class AppModule { }
