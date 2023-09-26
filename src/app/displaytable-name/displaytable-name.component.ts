import { Component } from '@angular/core';
import { EntityListDto } from '../Models/EntitylistDto.model';
import { EntitylistService } from '../Services/entitylist.service';

@Component({
  selector: 'app-displaytable-name',
  templateUrl: './displaytable-name.component.html',
  styleUrls: ['./displaytable-name.component.css']
})
export class DisplaytableNameComponent {
  tableNames: EntityListDto[] = [];
  errorMessage:string = '';

  constructor(private entitylistService: EntitylistService ) { }

  ngOnInit(): void {
    console.log('ngOnInit called'); 
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        console.log('Received data:', data);
        this.tableNames = data.result;
      },
      (error) => {
        console.error('Error fetching table names:', error);
        this.errorMessage = 'No Data Available';  // Update error message
      }
      
    );
    
  }
}
