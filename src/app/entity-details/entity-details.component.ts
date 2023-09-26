// entity-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumn } from '../Models/TableColumn.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; // Import the xlsx library

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
  entityName!: string;
  columns: TableColumn[] = [];

  constructor(private route: ActivatedRoute, private columnsService: ColumnsService, private router: Router ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityName = params['entityName'];
      this.fetchColumnsData();
    });
  }
  private downloadExcelFile(data: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_template.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  goBackToList(){
    this.router.navigate(['/entity-list']);
  }
  generateExcelTemplate() {
    if (this.columns.length === 0) {
      return; // Do nothing if there are no columns
    }
    // Extract the column names from the columns array
    const columnNames = this.columns.map((column) => column.entityColumnName);
  
    // Create an array of arrays with only the column names as headers
    const data: any[][] = [columnNames]; // Array of arrays
  
    // Create a worksheet from the 2D data array
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  
    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Convert the workbook to an array buffer
    const excelArrayBuffer: ArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create and trigger the download link
    const blob = new Blob([excelArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_template.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  fetchColumnsData(): void {
    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result;
        } else {
          console.error('Error fetching columns data:', data.errorMessage);
          // Handle the error as needed
        }
      },
      (error) => {
        console.error('Error fetching columns data:', error);
        // Handle the error as needed
      }
    );

    
  }
  toggleNullable(column: TableColumn): void {
    column.isNullable = !column.isNullable;
  }
  
  // Function to toggle the value of isPrimaryKey property
  togglePrimaryKey(column: TableColumn): void {
    column.isPrimaryKey = !column.isPrimaryKey;
  }
}
