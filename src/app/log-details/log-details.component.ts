import { Component } from '@angular/core';
import { ColumnInputServiceService } from '../Services/column-input-service.service';
import { LogparentService } from '../Services/LogparentService'; 
import { SharedDataService } from '../Services/SharedData.service';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  tableData: any[] = [];
  entityName: string = '';
  totalCounts: number = 0;
  successCounts: number = 0;
  errorCounts: number = 0;
  timestamp: string = '';
  logParentID: number = 0;
  userID: number = 0;

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        // Assign received data to component properties
        this.entityName = data.entityName;
        this.totalCounts = data.totalCounts;
        this.successCounts = data.successCounts;
        this.errorCounts = data.errorCounts;
        this.timestamp = data.timestamp;
        this.logParentID = data.logParentID;
        this.userID = data.userID;
        this.tableData = data.tableData;
      }
    });
  }
}