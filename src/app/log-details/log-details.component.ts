import { Component } from '@angular/core';
import { SharedDataService } from '../Services/SharedData.service';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  logParent: any;
  logChildren!: any[];

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        console.log(data)
        this.logParent = data.result.logParentDTOs; // Access the logParent object
        this.logChildren = data.result.childrenDTOs; // Access the childrenDTOs array
      }
    });
  }

  generateErrorExcelTemplate(){

  }
}
