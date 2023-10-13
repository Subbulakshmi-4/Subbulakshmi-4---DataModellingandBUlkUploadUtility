import { Component } from '@angular/core';
import { ColumnInputServiceService } from '../Services/column-input-service.service';
import { LogparentService } from '../Services/LogparentService'; 

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  tableData: any[] | undefined;
  entityName: string | undefined;
  totalCounts: number | undefined;
  successCounts: number | undefined;
  errorCounts: number | undefined;
  timestamp: string | undefined;
  logParentID: number | undefined;
  userID:number|undefined;
 

  ngOnInit(): void {
    // Manually set mock data for testing
    const response = {
      "statusCode": 201,
      "isSuccess": true,
      "errorMessage": ["Data saved to the database Successfully."],
      "result": {
        "logParent": {
          "id": 2,
          "timestamp": "2023-10-12T12:30:39.626314Z",
          "recordCount": 4,
          "passCount": 3,
          "failCount": 1,
          "user_Id": 1,
          "fileName": "Employe_template (1).xlsx",
          "entity_Id": 1
        },
        "logChildren": [
          {
            "id": 2,
            "parentID": 2,
            "errorMessage": "Datatype validation failed",
            "filedata": "2,Sathihs,02-10-1999,909;3,Saravanan,23-11-1997,0",
            "parentLogID": 0
          }
        ]
      }
    };

    // Extract data from the response
    const logParent = response.result.logParent;
    const logChildren = response.result.logChildren;

    // Set data to component properties
    this.entityName = logParent.fileName;
    this.totalCounts = logParent.recordCount;
    this.userID = logParent.user_Id;
    this.successCounts = logParent.passCount;
    this.errorCounts = logParent.failCount;
    this.timestamp = logParent.timestamp; 
    this.logParentID = logParent.id;

    // Prepare table data
    this.tableData = logChildren.map(child => ({
      parentID: child.parentID,
      logChildId: child.id,  // Include logChildId in the tableData array
      logParentId: logParent.id,  // Include logParentId in the tableData array
      errorMessage: child.errorMessage,
      userID:logParent.user_Id,
      filedata: child.filedata,
      timestamp: logParent.timestamp 
    }));
  }
  // response: any;
  // entityName: string = "";
  // totalCounts: number = 0;
  // successCounts: number = 0;
  // errorCounts: number = 0;
  // tableData: any[] = [];

  constructor(private excelService: LogparentService) { }

  // ngOnInit(): void {
  //   // Call your API service method here, for example:
  //   this.excelService.generateExcelFile(yourColumnsData).subscribe(
  //     (data: any) => {
  //       this.response = data;
  //       this.handleApiResponse(this.response);
  //     },
  //     error => {
  //       console.error('Error generating Excel file:', error);
  //       // Handle errors here
  //     }
  //   );
  // }

  // handleApiResponse(response: any): void {
  //   if (response && response.isSuccess) {
  //     this.entityName = response.result.logParent.fileName;
  //     this.totalCounts = response.result.logParent.recordCount;
  //     this.successCounts = response.result.logParent.passCount;
  //     this.errorCounts = response.result.logParent.failCount;
  //     this.tableData = response.result.logChildren;
  //   } else {
  //     // Handle error response
  //     console.error('Error response from API:', response);
  //     // You can set default values or display error messages as needed
  //   }
  // }
}
