import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnInputServiceService } from '../Services/column-input-service.service';
import { ToastrService } from '../Services/ToastrService';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css']
})
export class CreateEntityComponent {
  minDate: string = ''; // Initialize minDate variable
  maxDate: string = ''; // I
  entityForm: any;
  showModal: boolean = false;
  showAdditionalInputs: boolean = false;
  additionalInput1: string = '';
  additionalInput2: string = '';

  constructor( private toastrService : ToastrService,
              private router: Router,
              private  columnInputService: ColumnInputServiceService,
              private modalService: NgbModal
    ){}
    
  selectedDataType: string = 'string'; 
  newEntity: any = {
    entityname: '',
    columns: [
      {
        columnName: '',
        datatype: 'string',
        length: 0,
        isNullable: false,
        true:'',
        false:'',
        primaryKey: false,
        defaultValue: '',
        description: '',
        minLength:'',
        maxLength:'',
        MinRange:'',
        MaxRange:'',
        dateminValue:"",
        datemaxValue:""
      }
    ]
  };

  // Function to add a new row
  addNewRow() {
    this.newEntity.columns.push({
      columnName: '',
      datatype: 'string',
      length: 0,
      isNullable: false,
      true:'',
      false:'',
      primaryKey: false,
      defaultValue: '',
      description: '',
      minLength:'',
      maxLength:'',
      MinRange:'',
      MaxRange:'',
      dateminValue:"",
      datemaxValue:""
    });
    this.entityForm.form.updateValueAndValidity();
  }
  showBooleanPopup: boolean = false;

  onMinDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.minDate = inputElement.value;
    // Update row.dateminValue if needed
}

onMaxDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxDate = inputElement.value;
    // Update row.datemaxValue if needed
}
onDataTypeChange(row: any) {
  if (row.datatype === 'int' || row.datatype === 'boolean' || row.datatype === 'char' ||
      row.datatype === 'date' || row.datatype === 'bytea' || row.datatype === 'timestamp') {
      row.length = "";
    }
    if(row.datatype === 'boolean' ){
      this.showModal = true;
      this.showAdditionalInputs = true;
    } else {
      this.showModal = false;
      this.showAdditionalInputs = false;
    }
}

closeModal() {
  this.showModal = false;
}
  // Function to delete a row
  deleteRow(index: number) {
    if (this.newEntity.columns.length > 1) {
      this.newEntity.columns.splice(index, 1);
    }
  }

  // Function to check if a row is valid
  rowValid(index: number): boolean {
    const row = this.newEntity.columns[index];
    return !!row.columnName && !!row.datatype;
  }

  hasDuplicateColumnNames(): boolean {
    const columnNames = new Set<string>();
    for (const row of this.newEntity.columns) {
      if (row.columnName && columnNames.has(row.columnName)) {
        return true; 
      }
      columnNames.add(row.columnName);
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
    for (const row of this.newEntity.columns) {
      if (row.primaryKey) {
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
  
  onDefaultValueInputChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (row.datatype === 'int') {
      inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
    }
  }
  
  isEntityNameValid(): boolean {
    const entityNameInput = this.newEntity.entityname;
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(entityNameInput);
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
  const reservedKeywordFound = this.isReservedKeyword(this.newEntity.entityname) || this.newEntity.columns.some((column: { columnName: string; }) => this.isReservedKeyword(column.columnName));

  if (reservedKeywordFound) {
    this.toastrService.showError('Table or column name cannot be a reserved keyword.');
    return; 
  }

for (const column of this.newEntity.columns) {
  if (column.datatype === 'int' && column.MaxRange !== null && column.MinRange !== null) {
      if (column.MinRange === 0 || column.MaxRange === 0) {
          errorMessages.push('Min Range and Max Range cannot both be 0.');
          this.toastrService.showError('MinRange and MaxRangecannot both be 0.');
      } else if (column.MaxRange <= column.MinRange) {
          errorMessages.push('Max Range must be higher than MinRange.');
          this.toastrService.showError('Max Range must be higher than MinRange.');
      }
  }

  if (column.datatype === 'string' && column.maxLength !== null && column.minLength !== null) {
    if (column.minLength === 0 || column.maxLength === 0) {
        errorMessages.push('MinLength and MaxLength cannot be 0.');
        this.toastrService.showError('Min Length and Max Length cannot be 0.');
    } else if (column.maxLength <= column.minLength) {
        errorMessages.push('Max Length must be higher than Min Length.');
        this.toastrService.showError('Max Length must be higher than Min Length.');
    }
}
}

  for (const column of this.newEntity.columns) {
    if (column.datatype === 'date' && column.datemaxValue <= column.dateminValue) {
      errorMessages.push('Max Date must be after Min Date.');
      this.toastrService.showError('Max Date must be after Min Date.');
    }
  }

  if(!this.isEntityNameValid()){
    errorMessages.push('Table Name patern is invalid');
    this.toastrService.showError('Table Name patern is invalid');
  }

  if (!this.newEntity.entityname) {
    errorMessages.push('Table Name is required.');
    this.toastrService.showError('Table Name is required.');
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
    const formData = {
      entityname: this.newEntity.entityname,
      columns: this.newEntity.columns
    };
    const backendRequest = {
          tableName: formData.entityname,
          columns: formData.columns.map((columns: any) => {
            return {
              entityColumnName: columns.columnName,
              dataType: columns.datatype,
              length: columns.length || 0,
              true:columns.true,
              false:columns.false ,
              isNullable: columns.isNullable,
              defaultValue: columns.defaultValue,
              columnPrimaryKey: columns.primaryKey,
              Description:columns.description,
              minLength: parseInt(columns.minLength), 
              maxLength: parseInt(columns.maxLength),
              MaxRange: parseInt(columns.MaxRange),
              MinRange: parseInt(columns.MinRange),
              dateminValue:columns.dateminValue,
              datemaxValue:columns.datemaxValue
            };
          }),
        }

        console.log(backendRequest);
  this.columnInputService.createTable(backendRequest).subscribe(
    response => {
      // Handle success response if needed
      console.log('Table created successfully:', response.success);
      this.toastrService.showSuccess('Table created successfully');
      this.router.navigate(['/entity-list']);
    },
    error => {
      // Handle error response and display error message
      console.error('Error creating table:', error);
      this.toastrService.showError('Error creating table: ' + error);
    }
  );
  }
}
}
