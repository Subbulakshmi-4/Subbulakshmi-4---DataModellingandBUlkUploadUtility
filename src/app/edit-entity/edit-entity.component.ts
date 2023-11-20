import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { AlertService } from '../Services/AlertService'; 
import { ToastrService } from '../Services/ToastrService';
import { SharedDataService } from '../Services/SharedData.service';
import { LogDetailsComponent } from '../log-details/log-details.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogDetailsDTO } from '../Models/LogDetailsDTO';
import { ColumnInputServiceService } from '../Services/column-input-service.service';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntityListDto } from '../Models/EntitylistDto.model';
import { EntitylistService } from '../Services/entitylist.service';
import { NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TableEditColumnDTO } from '../Models/TableEditColumnDTO';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.css']
})
export class EditEntityComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef; // Add this line
  entityName!: string;
  columns: TableEditColumnDTO[] = [];
  minDate: string = ''; // Initialize minDate variable
  maxDate: string = ''; // I
  entityForm: any;
  showModal: boolean = false;
  showAdditionalInputs: boolean = false;
  additionalInput1: string = '';
  additionalInput2: string = '';
  selectedEntity: string = '';
  selectedEntitys: string = '';
  SelectedEntityName:string='';
  @Input() selectedEntityColumns: any; // Assuming selectedEntityColumns is an input
  listOfValues: EntityListDto[] = [];
  entityColumnNames1: string[] = []; // Array for the first dropdown
  entityColumnNames2: string[] = []; // Array for the second dropdown
  selectedEntity2: string | null = null;
  selectedEntity2Index: number | null = null;
  selectedKeyId: number | null = null;
  selectedColumnIds: any;
  firstColumnId: number | null = null; // Initialize firstColumnId with a default value of null
  cdr: any;

  // logDetails: LogDetailsDTO = new LogDetailsDTO();

  constructor(private route: ActivatedRoute,
     private columnsService: ColumnsService, 
     private router: Router, private toastrService: ToastrService,
       private sharedDataService: SharedDataService, 
       private  columnInputService: ColumnInputServiceService,
       private modalService: NgbModal,
       private entitylistService :EntitylistService,
       private zone: NgZone
       ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityName = params['entityName'];
      console.log(this.entityName)
      this.fetchColumnsData();
      this.fetchEntityIdByName(this.entityName);
    });
  
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.listOfValues = data.result;
      },
      (error) => {
        console.error('Error fetching entity names:', error);
      }
    );
    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            console.log('API Response - isPrimaryKey:', columnData.columnPrimaryKey);
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId:columnData.entityid,
              datatype: columnData.datatype,
              length: columnData.length,
              minLength:columnData.minLength,
              maxLength:columnData.maxLength,
              minRange:columnData.minRange,
              maxRange:columnData.maxRange,
              dateMinValue:columnData.dateMinValue,
              dateMaxValue:columnData.dateMaxValue,
              description:columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey, 
              True: columnData.true, 
              False: columnData.false, 
            };
            console.log(column);
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
    console.log(this.columns)
  }
  hasColumns(): boolean {
    return this.columns.length > 0;
  }
  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  goBackToList(){
    this.router.navigate(['/entity-list']);
  }
 fetchEntityIdByName(entityName: string): void {
    this.sharedDataService.getEntityIdByName(entityName).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.selectedKeyId = response.result;
          console.log(this.selectedKeyId)
          this.columns.forEach((column) => {
            column.entityId = this.selectedKeyId || 0;
          });
        } else {
          console.error('Error fetching entityId:', response.errorMessage);
          this.toastrService.showError('Error fetching entityId');
        }
      },
      (error) => {
        console.error('HTTP Error Response:', error);
        this.toastrService.showError('Unexpected error fetching entityId');
      }
    );
  }
  fetchColumnsData(): void {
    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            console.log('API Response - isPrimaryKey:', columnData.columnPrimaryKey);
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId: columnData.entityid,
              datatype: columnData.datatype,
              length: columnData.length,
              minLength:columnData.minLength,
              maxLength:columnData.maxLength,
              minRange:columnData.minRange,
              maxRange:columnData.maxRange,
              dateMinValue:columnData.dateMinValue,
              dateMaxValue:columnData.dateMaxValue,
              description:columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey, 
              True: columnData.true, 
              False: columnData.false,
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
  
  toggleNullable(column: TableEditColumnDTO): void {
    column.isNullable = !column.isNullable;
  }

  // Function to toggle the value of isPrimaryKey property
  togglePrimaryKey(column: TableEditColumnDTO): void {
    column.ColumnPrimaryKey = !column.ColumnPrimaryKey;
  }

  selectedDataType: string = 'string'; 
  NewEntity: any = {
    entityname: '',
    columns: [
      {
        columnName: '',
        datatype: 'string',
        length: 0,
        isNullable: false,
        True:'',
        False:'',
        ColumnPrimaryKey: false,
        defaultValue: '',
        description: '',
        minLength:'',
        maxLength:'',
        minRange:'',
        maxRange:'',
        dateMinValue:"",
        dateMaxValue:"",
        ListEntityId:this.selectedEntity,
        ListEntityKey:this.firstColumnId,
        ListEntityValue:this.selectedKeyId
      }
     ]
  };
  Editcolumns: any[] = [];
  // Function to add a new row
  addNewRow() {
    const newRow: TableEditColumnDTO = {
      entityname: '',
      id: 0,
      entityId: 0,
      entityColumnName: '',
      datatype: 'string',
      length: 0,
      isNullable: false,
      True: '',
      False: '',
      ColumnPrimaryKey: false,
      defaultValue: '',
      description: '',
      minLength: '',
      maxLength: '',
      minRange: '',
      maxRange: '',
      dateMinValue: '',
      dateMaxValue: '',
    };
    this.columns.push(newRow);
  }
  showBooleanPopup: boolean = false;
onListValueSelected(entityName: string, rowIndex: number) {
   this.zone.run(() => {
      this.selectedEntity = entityName;
      console.log(this.selectedEntity);
      this.SelectedEntityName = this.selectedEntity
      console.log(this.SelectedEntityName)
      // Fetch columns for the selected entity
      this.columnsService.getColumnsForEntity(this.selectedEntity).subscribe(columns => {
         this.entityColumnNames1 = columns.map(column => column.entityColumnName);
         this.entityColumnNames2 = columns.map(column => column.entityColumnName);
      });
      // Fetch columns for the selected entity
      this.fetchSelectedEntityColumns(entityName);
      // Update the row's selectedEntity property if needed
      this.NewEntity.columns[rowIndex].selectedEntity = entityName;
   });
}
selectedEntity2Indexs: number | null = null;

updateSelectedId(index: number) {
  if (index !== null && index >= 0 && index < this.selectedColumnIds.length) {
    this.selectedKeyId = this.selectedColumnIds[index];
    console.log(this.selectedKeyId)
  } else {
    this.selectedKeyId = null; // Handle the case when the index is out of range
  }
}
validateMinMax(row: any) {
  if (row.minLength > row.maxLength) {
      this.toastrService.showError('Min value must be smaller than Max value');
      row.minLength = null;
      row.maxLength = null;
  }
  // Additional validation logic if needed.
}
validateMinMaxRange(row: any) {
  if (row.minRange > row.maxRange) {
    this.toastrService.showError('Min value must be smaller than Max value', 'Validation Error');
    row.minRange = null;
    row.maxRange = null;
  }
}
calculateDefaultDate(dateMinValue: string, dateMaxValue: string): string {
  const defaultDate = new Date((new Date(dateMinValue).getTime() + new Date(dateMaxValue).getTime()) / 2);
  return defaultDate.toISOString().substring(0, 10); 
}
setInitialDateValue(row: any) {
  if (row.datatype === 'date') {
    row.defaultValue = this.calculateDefaultDate(row.dateMinValue, row.dateMaxValue);
  }
}
validateDefaultDate(row: any) {
  if (row.datatype === 'date') {
    const defaultDate = new Date(row.defaultValue);
    const dateMinValue = new Date(row.dateMinValue);
    const dateMaxValue = new Date(row.dateMaxValue);

    if (defaultDate < dateMinValue || defaultDate > dateMaxValue) {
      row.defaultValue = this.calculateDefaultDate(row.dateMinValue, row.dateMaxValue);
      this.toastrService.showError('Default Date must be within the range of Min Date and Max Date', 'Validation Error');
    }
  }
}


  fetchSelectedEntityColumns(entityName: string) {
    this.columnsService.getColumnsForEntity(entityName).subscribe(
      (data: any) => {
        if (data && data.result) {
          this.selectedEntityColumns = data.result.map((column: any) => column.entityColumnName);
          this.selectedEntity = data.result[0].entityId; 
          this.selectedColumnIds = data.result.map((column: any) => column.id);
           this.firstColumnId = this.selectedColumnIds[0];
          this.entityColumnNames1 = this.selectedEntityColumns;
          this.entityColumnNames2 = this.selectedEntityColumns;
        } else {
          console.error('Invalid data structure in API response:', data);
        }
      },
      (error) => {
        console.error('Error fetching entity columns:', error);
      }
    );
  }
  
  onValueSelected() {
    if (this.selectedEntity2 !== null) {
      this.selectedEntity2Index = this.entityColumnNames2.indexOf(this.selectedEntity2);
      console.log(this.selectedEntity2Index)
    }
  }
onMinDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.minDate = inputElement.value;
}

onMaxDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxDate = inputElement.value;
}

closeModal() {
  this.showModal = false;
}
  deleteRow(index: number, event: Event) {
    event.preventDefault();
    if (this.columns.length > 1) {
      this.columns.splice(index, 1);
    }
  }

  rowValid(index: number): boolean {
    const row = this.NewEntity.columns[index];
    return !!row.columnName && !!row.datatype;
  }
  hasDuplicateColumnNames(): boolean {
    const columnNames = new Set<string>();
    for (const row of this.columns) {
      if (row.entityColumnName && columnNames.has(row.entityColumnName)) {
        return true; 
      }
      columnNames.add(row.entityColumnName);
    }
    return false; 
  }

     onInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;

        const numericValue = parseInt(inputValue, 10);

        if (numericValue < 0) {
            inputElement.value = '';
        }
    }

  // Function to check if there's exactly one primary key
  hasExactlyOnePrimaryKey(): boolean {
    let primaryKeyCount = 0;
    for (const row of this.columns) {
      if (row.ColumnPrimaryKey) {
        primaryKeyCount++;
      }
    }
    return primaryKeyCount === 1;
  }
  preventSubmitOnEnter(event: KeyboardEvent, form: NgForm): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
  onPrimaryKeyChange(event: Event, row: any): void {
    if (row.primaryKey) {
        row.defaultValue = '';
    }
    if(row.minLength){
      row.defaultValue = '';
    }
    if(row.maxLength){
      row.defaultValue = '';
    }
    if(row.minRange){
      row.defaultValue = '';
    }
    if(row.maxRange){
      row.defaultValue = '';
    }
    if(row.dateMinValue){
      row.defaultValue = '';
    }
    if(row.dateMaxValue){
      row.defaultValue = '';
    }
}

validateNumeric(event: any) {
  const keyCode = event.keyCode;
  if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(keyCode) !== -1 ||
      (keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 88 && (event.ctrlKey || event.metaKey))
  ) {
      return;
  }
  if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
      event.preventDefault();
  }
}

  onDefaultValueInputChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (row.datatype === 'int') {
      inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }
  }
  
  isEntityNameValid(): boolean {
    const entityNameInput = this.columns;
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(this.entityName);
  }
  
   reservedKeywords: string[] = [
    'abort','asc','between','case','create','database','delete','desc','drop','false','from','full',
    'group','having','insert','into','is','join','left','like','limit','not','null','on','order','primary',
    'references','right','select','set','table','then','true','update','values','where','and','or','innerjoin',
    'leftjoin','rightjoin','orderby','groupby','create','alter','primarykey','foreignkey'
  ]; 
  isReservedKeyword(name: string): boolean {
    return this.reservedKeywords.includes(name.toLowerCase());
  }
  
submit() {
  const errorMessages: string[] = [];
  const reservedKeywordFound = this.isReservedKeyword(this.NewEntity.entityname) || this.NewEntity.columns.some((column: { columnName: string; }) => this.isReservedKeyword(column.columnName));
  if (reservedKeywordFound) {
    this.toastrService.showError('Entity or column name cannot be a reserved keyword.');
    return; 
  }

for (const column of this.NewEntity.columns) {
  if (column.datatype === 'int' && column.maxLength !== null && column.minLength !== null && column.minLength !== '' && column.maxLength !== '') {
    const minLength = parseInt(column.minLength);
    const maxLength = parseInt(column.maxLength);
    if (minLength === 0 || maxLength === 0) {
      errorMessages.push('Min Length and Max Length cannot both be 0.');
      this.toastrService.showError('Min Length and Max Length cannot both be 0.');
    } else if (maxLength <= minLength) {
      errorMessages.push('Max Length must be higher than Min Length.');
      this.toastrService.showError('Max Length must be higher than Min Length.');
    }
  }
   
    if (column.datatype === 'string' && column.maxLength !== null && column.minLength !== null && column.minLength !== '' && column.maxLength !== '') {
        const minLength = parseInt(column.minLength);
        const maxLength = parseInt(column.maxLength);
        if (minLength === 0 || maxLength === 0) {
            errorMessages.push('Min Length and Max Length cannot be 0.');
            this.toastrService.showError('Min Length and Max Length cannot be 0.');
        } else if (maxLength <= minLength) {
            errorMessages.push('Max Length must be higher than Min Length.');
            this.toastrService.showError('Max Length must be higher than Min Length.');
        }
    }
  }
  for (const column of this.NewEntity.columns) {
    if (column.datatype === 'date' && column.dateMaxValue <= column.dateMinValue) {
      errorMessages.push('Max Date must be after Min Date.');
      this.toastrService.showError('Max Date must be after Min Date.');
    }
  }

  if(!this.isEntityNameValid()){
    errorMessages.push('Entity Name pattern is invalid');
    this.toastrService.showError('Entity Name patern is invalid');
  }

  if (this.hasDuplicateColumnNames()) {
    errorMessages.push('Duplicate column names are not allowed.');
    this.toastrService.showError('Duplicate column names are not allowed.');
  }

  if (!this.hasExactlyOnePrimaryKey()) {
    errorMessages.push('Exactly one Primary Key is required.');
    this.toastrService.showError('Exactly one Primary Key is required.');
  }
  if (errorMessages.length > 0) {
    console.log('Form validation failed:');
    for (const errorMessage of errorMessages) {
      console.log(errorMessage);
    }
  } else {
    const filteredColumns = this.columns.map(column => ({
      entityColumnName: column.entityColumnName,
      datatype: column.datatype,
      length: column.length,
      isNullable: column.isNullable,
      True: column.True,
      False: column.False,
      ColumnPrimaryKey: column.ColumnPrimaryKey,
      defaultValue: column.defaultValue,
      description: column.description,
      minLength: parseInt(column.minLength) || 0,
      maxLength: parseInt(column.maxLength) || 0,
      minRange: parseInt(column.minRange) || 0,
      maxRange: parseInt(column.maxRange) || 0,
      dateMinValue: column.dateMinValue,
      dateMaxValue: column.dateMaxValue,
      ListEntityId: parseInt(this.selectedEntity) || 0,
      ListEntityKey: this.firstColumnId || 0,
      ListEntityValue: this.selectedKeyId || 0
    }));
  
    const backendRequest = {
      entityName: this.entityName,
      entityId: this.selectedKeyId || 0, // Include EntityId in the request
      update: {
        propertiesList: filteredColumns
      }
    };
  console.log(backendRequest)
    this.sharedDataService.updateEntityColumn(backendRequest).subscribe(
      response => {
        if (response.isSuccess) {
          console.log('Entity updated successfully:', response.result);
          this.toastrService.showSuccess('Entity updated successfully');
          this.router.navigate(['/entity-list']);
        } else {
          console.error('Error updating entity column. Server response:', response.errorMessage);
          this.toastrService.showError('Error updating entity column');
        }
      },
      error => {
        console.error('HTTP Error Response:', error);
        this.toastrService.showError('Unexpected error updating entity column');
      }
    );
  }
}
}
