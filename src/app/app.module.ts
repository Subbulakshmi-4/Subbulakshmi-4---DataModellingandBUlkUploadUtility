import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DisplaytableNameComponent } from './displaytable-name/displaytable-name.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServerConfigurationComponent } from './server-configuration/server-configuration.component';
import { ColumnInputServiceService } from './Services/column-input.service';
import { TableListComponent } from './table-list/table-list.component';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { ToastrService } from './Services/ToastrService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    DisplaytableNameComponent,
    EntityDetailsComponent,
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
    NgbModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000, 
      positionClass: 'toast-top-right', 
      preventDuplicates: true,
    })
  ],
  bootstrap: [AppComponent,ToastrService,ColumnInputServiceService]
})
export class AppModule { }
