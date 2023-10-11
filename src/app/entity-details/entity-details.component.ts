// entity-details.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { AlertService } from '../Services/AlertService'; 
import { ToastrService } from '../Services/ToastrService';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Add this line
  entityName!: string;
  columns: TableColumnDTO[] = [];

  constructor(private route: ActivatedRoute, private columnsService: ColumnsService, private router: Router, private toastrService: ToastrService   ) {}

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
      console.log('Template uploaded successfully:', response);

      if (response.isSuccess) {
        if (response.successMessage) {
          this.toastrService.showSuccess(response.successMessage);
        } else {
          this.toastrService.showSuccess('Data saved to the database.');
        }
      } else {
        const errorMessage = response.errorMessage?.[0] || 'An error occurred while uploading the template.';
        console.log('Extracted error message:', errorMessage);
        this.toastrService.showError(errorMessage);
      }
    },
    (error: any) => {
      console.error('Error uploading template:', error);

      if (error.error && error.error.errorMessage && error.error.errorMessage.length > 0) {
        const errorMessage = error.error.errorMessage[0] || 'An error occurred while uploading the template.';
        this.toastrService.showError(errorMessage);
      } else {
        this.toastrService.showError('An error occurred while uploading the template.');
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
  
    // Make a request to your backend to generate the Excel file
    this.columnsService.generateExcelFile(this.columns).subscribe(
      (data: Blob) => {
        // Create a blob from the response data
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create a temporary URL and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.entityName}_template.xlsx`;
        document.body.appendChild(a);
        a.click();
  
        // Clean up the temporary URL
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.error('Error generating Excel template:', error);
        // Handle the error as needed
      }
    );
  }

  
  fetchColumnsData(): void {
    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              datatype: columnData.datatype,
              length: columnData.length,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              isPrimaryKey: columnData.columnPrimaryKey, // Set isPrimaryKey based on columnPrimaryKey from the server
            };
            return column;
          });
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
