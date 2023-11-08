  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { DisplaytableNameComponent } from './displaytable-name/displaytable-name.component';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { LogDetailsComponent } from './log-details/log-details.component';



const routes: Routes = [
  { path: '', component: DisplaytableNameComponent},
  { path: 'entity-list', component: DisplaytableNameComponent }, // Add this line
  { path: 'entity/:entityName', component: EntityDetailsComponent },
  {path:'createentity',component:CreateEntityComponent},
  {path:'Log-details',component:LogDetailsComponent}
];


  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
