  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { DisplaytableNameComponent } from './displaytable-name/displaytable-name.component';
import { InputcolumnsComponent } from './ColumnInputs/inputcolumns/inputcolumns.component';



const routes: Routes = [
  { path: '', component: DisplaytableNameComponent },
  { path: 'entity-list', component: DisplaytableNameComponent }, // Add this line
  { path: 'entity/:entityName', component: EntityDetailsComponent },
  {path: 'createtable', component : InputcolumnsComponent}
  // ... other routes
];

  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
