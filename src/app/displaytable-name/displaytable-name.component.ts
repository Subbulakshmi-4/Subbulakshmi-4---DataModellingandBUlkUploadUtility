import { Component, OnInit } from '@angular/core';
import { EntityListDto } from '../Models/EntitylistDto.model';
import { EntitylistService } from '../Services/entitylist.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-displaytable-name',
  templateUrl: './displaytable-name.component.html',
  styleUrls: ['./displaytable-name.component.css']
})

export class DisplaytableNameComponent implements OnInit {
  tableNames: EntityListDto[] = [];
  errorMessage: string = '';

  constructor(private entitylistService: EntitylistService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.tableNames = data.result;
      },
      (error) => {
        console.error('Error fetching table names:', error);
        this.errorMessage = 'No Data Available';  // Update error message
      }
    );
  }

  onEntityClicked(entityName: string): void {
    this.router.navigate(['/entity', entityName]); // Navigate to EntityDetailsComponent with entityName parameter
  }
}
