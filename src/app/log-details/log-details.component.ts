import { Component } from '@angular/core';
import { SharedDataService } from '../Services/shared-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnsService } from '../Services/columns.service';
import { TableColumnDTO } from '../Models/tablecolumn-dto.model';
@Component({ 
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  logParent: any;
  parentId: number | undefined;
  logChildren!: any[];
  columns: TableColumnDTO[] = [];
  entityName: string = ''; // Initialize entityName variable
  
  constructor(private sharedDataService: SharedDataService,private columnsService: ColumnsService) { }

  ngOnInit(): void {
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        this.logParent = data.result.logParentDTOs; 
        this.logChildren = data.result.childrenDTOs; 
        this.entityName = this.extractEntityName(this.logParent.fileName);
        this.parentId = this.logParent.id
        console.log(this.logChildren)
      }
    });
  }
 
  onButtonClick(): void {
    const entityName = this.entityName;
    const parentId = this.parentId;

    if (parentId !== undefined) {
      this.fetchColumnsData(entityName);
      this.generateExcelTemplates(parentId);
    } else {
      console.error('parentId is undefined. Unable to generate Excel template.');
    }
  }

  fetchColumnsData(entityName: string): void {
    this.columnsService.getColumnsForEntitys(entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId: columnData.entityid,
              datatype: columnData.datatype,
              length: columnData.length,
              description: columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey,
              True: columnData.true,
              False: columnData.false,
              minLength:columnData.minLength,
              maxLength:columnData.maxLength,
              minRange: columnData.minRange,
              maxRange:columnData.maxRange,
              dateMinValue:columnData.dateMinValue,
              dateMaxValue:columnData.dateMaxValue
            };
            return column;
          });
        } else {
        }
      },
      (error) => {
      }
    );
  }

  generateExcelTemplates(parentId: number) {
    if (this.columns.length === 0) {
      return; 
    }
    this.columnsService.generateExcelFiles(parentId, this.columns).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.entityName}_Export.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
      }
    );
  }
  


  saveExcelFiles(data: Blob): void {
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
