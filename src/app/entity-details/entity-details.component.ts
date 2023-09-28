// entity-details.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { AlertService } from '../Services/AlertService'; 
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Add this line
  entityName!: string;
  columns: TableColumnDTO[] = [];

  constructor(private route: ActivatedRoute, private columnsService: ColumnsService, private router: Router, private alertService: AlertService, private toastr: ToastrService   ) {}

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
  hasColumns(): boolean {
    return this.columns.length > 0;
  }
  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }
  uploadTemplate(event: any) {
    const file = event.target.files[0];
    const tableName = this.entityName; // Replace with the actual table name
  
    // Create a FormData object to send the file and table name
    const formData = new FormData();
    formData.append('file', file);
  
    // Make the API request with the updated function
    this.columnsService.uploadTemplate(formData, tableName).subscribe(
      (response: any) => {
        // Handle the response from the API (if needed)
        console.log('Template uploaded successfully:', response);
  
        if (response.errorMessage && response.errorMessage.length > 0) {
          // Display the error message as an alert
          window.alert(response.errorMessage[0]);
        } else {
          // Display a default success message if errorMessage is not available
          window.alert('Data saved to the database.');
        }
  
        // You can perform additional actions here if needed
      },
      (error: any) => {
        console.error('Error uploading template:', error);
      
        if (error.error && error.error.errorMessage && error.error.errorMessage.length > 0) {
          // Extract the error message from the API response and display it as an alert
          const errorMessage = error.error.errorMessage[0];
          window.alert(errorMessage);
        } else {
          // If error.errorMessage doesn't exist or is empty, display a generic error message
          window.alert('An error occurred while uploading the template.');
        }
      }
      
    );
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
  toggleNullable(column: TableColumnDTO): void {
    column.isNullable = !column.isNullable;
  }

  // Function to toggle the value of isPrimaryKey property
  togglePrimaryKey(column: TableColumnDTO): void {
    column.isPrimaryKey = !column.isPrimaryKey;
  }
}
