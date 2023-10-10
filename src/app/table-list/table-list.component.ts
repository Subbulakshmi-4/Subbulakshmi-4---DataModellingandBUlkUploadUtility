import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../Services/entitylist.service'; // Adjust the import path as needed

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tableNames: any[] = [];

  constructor(private entitylistService: EntitylistService) {}

  ngOnInit(): void {
    this.fetchTableNames();
  }

  fetchTableNames(): void {
    this.entitylistService.getEntityList().subscribe(
      (data: any[]) => {
        this.tableNames = data;
      },
      (error) => {
        console.error('Error fetching table names:', error);
        // Handle the error as needed
      }
    );
  }
}
