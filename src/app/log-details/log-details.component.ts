import { Component } from '@angular/core';
import { SharedDataService } from '../Services/SharedData.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  logParent: any;
  isExporting: boolean = false;
  parentId: number | undefined;
  logChildren!: any[];
  logChildrenId: [] | undefined;
  columns: TableColumnDTO[] = [];
  entityName: string = '';
  private apiUrl = 'https://localhost:7245/api/ExportExcel';
  
  constructor(private sharedDataService: SharedDataService,private columnsService: ColumnsService,private Renderer2:Renderer2) { }
 
  ngOnInit(): void {
    this.fetchColumnsData;
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.logParent = data.result.logParentDTOs; 
        this.logChildren = data.result.childrenDTOs; 
        console.log(this.logChildren)
        this.entityName = this.extractEntityName(this.logParent.fileName);
        this.parentId = this.logParent.id
        const ids = this.logChildren.map(item => item.id);
        console.log(ids);
      }
    });
  }

  onButtonClick(): void {
    const entityName = this.entityName;
    this.fetchColumnsData(entityName);
    this.openExportModal();
  }
  
  openExportModal() {
    const modal = document.getElementById('exportModal');
    this.Renderer2.addClass(modal, 'show');
    this.Renderer2.setStyle(modal, 'display', 'block');
  }

  closeExportModal() {
    const modal = document.getElementById('exportModal');
    this.Renderer2.removeClass(modal, 'show');
    this.Renderer2.setStyle(modal, 'display', 'none');
  }

  exportData() {
    const entityName = this.entityName;
    const parentId = this.parentId;
    if (parentId !== undefined) {
      this.fetchColumnsData(entityName);
      this.generateExcelTemplates(parentId);
      this.closeExportModal();
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
            
            console.log(column)
            return column;
          });
        } else {
          console.error('Error fetching columns data:', data.errorMessage);
        }
      },
      (error) => {
        console.error('Error fetching columns data:', error);
      }
    );
  }

  generateExcelTemplates(parentId: number) {
    console.log('Columns data before sending to the backend:', this.columns);
    if (this.columns.length === 0) {
      this.isExporting = false; 
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
        this.isExporting = false; 
      },
      (error: any) => {
        console.error('Error generating Excel template:', error);
        this.isExporting = false; 
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
