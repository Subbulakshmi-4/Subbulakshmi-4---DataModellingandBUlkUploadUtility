import { Component } from '@angular/core';
import { SharedDataService } from '../Services/SharedData.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  logParent: any;
  logChildren!: any[];
  entityName: string = ''; // Initialize entityName variable
  private apiUrl = 'https://localhost:7245/api/ExportExcel';
  
  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.logParent = data.result.logParentDTOs; // Access the logParent object
        this.logChildren = data.result.childrenDTOs; // Access the childrenDTOs array

        // Extract entity name from logParent.fileName
        this.entityName = this.extractEntityName(this.logParent.fileName);

        // Get data for the entity
        this.getData(this.logParent.parentId); // Assuming parentId is used for API request
      }
    });
  }

  // getData(parentId: number): void {
  //   this.sharedDataService.getData(parentId).subscribe(
  //     (data: Blob) => {
  //       // Handle the binary response data here
  //       this.saveExcelFile(data);
  //     },
  //     error => {
  //       console.error('Error occurred while fetching data:', error);
  
  //       // Log the error response
  //       if (error instanceof HttpErrorResponse) {
  //         console.error('Error Response:', error.error);
  //       }
  //     }
  //   );
  // }
  getData(parentId: number): void {
    const entityName = this.extractEntityName(this.logParent.fileName); // Assuming you extract entityName somehow
    if (entityName) {
      this.sharedDataService.getData(parentId, entityName).subscribe(
        (data: Blob) => {
          // Handle the binary response data here
          this.saveExcelFile(data);
        },
        error => {
          console.error('Error occurred while fetching data:', error);
  
          // Log the error response
          if (error instanceof HttpErrorResponse) {
            console.error('Error Response:', error.error);
          }
        }
      );
    } else {
      console.error('Entity name not available.');
    }
  }
  
  
  saveExcelFile(data: Blob): void {
    // Create a Blob from the binary data
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a download link and trigger a download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_ExportData.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  

  // Function to extract entity name from a string
  extractEntityName(fullFileName: string): string {
    // Split the fullFileName using underscore as separator and get the first part
    const parts = fullFileName.split('_');
    if (parts.length > 0) {
      return parts[0]; // Return the first part as the entity name
    }
    return ''; // Return an empty string if extraction fails
  }

  generateErrorExcelTemplate() {
    // Your function logic here
  }
}
