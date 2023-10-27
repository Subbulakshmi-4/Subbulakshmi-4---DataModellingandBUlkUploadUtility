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
        this.logParent = data.result.logParentDTOs; 
        this.logChildren = data.result.childrenDTOs; 
        this.entityName = this.extractEntityName(this.logParent.fileName);
        this.getData(this.logParent.parentId, this.logParent.entityId);
      }
    });
  }

  getData(parentId: number, entityId: number): void {
    const entityName = this.extractEntityName(this.logParent.fileName); 
    if (entityName) {
      this.sharedDataService.getData(parentId, entityId, entityName).subscribe(
        (data: Blob) => {
          this.saveExcelFile(data);
        },
        error => {
          if (error instanceof HttpErrorResponse) {
          }
        }
      );      
    } else {
    }
}

  saveExcelFile(data: Blob): void {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_ExportData.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  extractEntityName(fullFileName: string): string {
    const parts = fullFileName.split('_');
    if (parts.length > 0) {
      return parts[0]; 
    }
    return ''; 
  }
}
