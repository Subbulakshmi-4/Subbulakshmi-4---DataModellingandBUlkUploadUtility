import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnInputServiceService } from '../Services/column-input-service.service';
import { ToastrService } from '../Services/ToastrService';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnsService } from '../Services/Columns.service';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';
import { EntityListDto } from '../Models/EntitylistDto.model';
import { EntitylistService } from '../Services/entitylist.service';


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
  selectedEntity: string = '';
  selectedEntitys: string = '';
  @Input() selectedEntityColumns: any; // Assuming selectedEntityColumns is an input
  listOfValues: EntityListDto[] = [];
  entityColumnNames1: string[] = []; // Array for the first dropdown
  entityColumnNames2: string[] = []; // Array for the second dropdown
  selectedEntity2: string | null = null;
  selectedEntity2Index: number | null = null;
  selectedKeyId: number | null = null;
  selectedColumnIds: any;
  firstColumnId: number | null = null; // Initialize firstColumnId with a default value of null



  constructor( private toastrService : ToastrService,
              private router: Router,
              private  columnInputService: ColumnInputServiceService,
              private modalService: NgbModal,
              private columnsService : ColumnsService,
              private entitylistService :EntitylistService
    ){
      
    }
    
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
        datemaxValue:"",
        ListEntityId:this.selectedEntity,
        ListEntityKey:this.firstColumnId,
        ListEntityValue:this.selectedKeyId

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
      datemaxValue:"",
      ListEntityId:this.selectedEntity,
      ListEntityKey:this.firstColumnId,
      ListEntityValue:this.selectedKeyId
    });
    this.entityForm.form.updateValueAndValidity();
  }
  ngOnInit(): void {
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.listOfValues = data.result;
      },
      (error) => {
        console.error('Error fetching entity names:', error);
      }
    );

  }

  showBooleanPopup: boolean = false;
  onListValueSelected(entityName: string, rowIndex: number) {
    this.selectedEntity = entityName;
  // Fetch the columns for the selected entity using your service
    this.columnsService.getColumnsForEntity(this.selectedEntity).subscribe(columns => {
      this.entityColumnNames1 = columns.map(column => column.entityColumnName);
      this.entityColumnNames2 = columns.map(column => column.entityColumnName);
    });
    // Fetch columns for the selected entity
    this.fetchSelectedEntityColumns(entityName);
    
    // Update the row's selectedEntity property if needed
    this.newEntity.columns[rowIndex].selectedEntity = entityName;
  }

  // fetchSelectedEntityColumns(entityName: string) {
  //   this.columnsService.getColumnsForEntity(entityName).subscribe(
  //     (data: any) => {
  //       if (data && data.result) {
  //         console.log("data",data.result)
  //         this.selectedEntityColumns = data.result.map((column: any) => column.entityColumnName);
  //         // this.selectedEntity = data.result.map((column: any) => column.entityId);
  //         // this.selectedKeyId = data.result.map((column: any) => column.id);
  //         // this.selectedKeyId = data.result.map((column: any) => column.id);
  //         this.entityColumnNames1 = this.selectedEntityColumns;
  //         this.entityColumnNames2 = this.selectedEntityColumns;
  //         console.log('selectedEntityColumns', this.selectedEntityColumns);
  //       } else {
  //         console.error('Invalid data structure in API response:', data);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching entity columns:', error);
  //     }
  //   );
  // }
  // Define a property to hold the selected ID
// Define a property to hold the selected index, initialize to -1
// Define a property to hold the selected index
selectedEntity2Indexs: number | null = null;

// Update the selected ID when the index changes
updateSelectedId(index: number) {
  if (index !== null && index >= 0 && index < this.selectedColumnIds.length) {
    this.selectedKeyId = this.selectedColumnIds[index];
    console.log(this.selectedKeyId)
  } else {
    this.selectedKeyId = null; // Handle the case when the index is out of range
  }
}


  fetchSelectedEntityColumns(entityName: string) {
    this.columnsService.getColumnsForEntity(entityName).subscribe(
      (data: any) => {
        if (data && data.result) {
          this.selectedEntityColumns = data.result.map((column: any) => column.entityColumnName);
          // Store the selected entity ID
          this.selectedEntity = data.result[0].entityId; // Assuming you want to store the ID of the first column
          console.log("this.selectedEntity1",this.selectedEntity)
          // Optionally, you can store the IDs of all columns
          this.selectedColumnIds = data.result.map((column: any) => column.id);
          console.log("this.selectedEntity2",this.selectedColumnIds)
           this.firstColumnId = this.selectedColumnIds[0];
          console.log('ID of the first column:', this.firstColumnId);
          this.entityColumnNames1 = this.selectedEntityColumns;
          console.log("this.selectedEntity3",this.entityColumnNames1)
          this.entityColumnNames2 = this.selectedEntityColumns;
          console.log("this.selectedEntity4",this.entityColumnNames2)
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
  onPrimaryKeyChange(event: Event, row: any): void {
    // Check if the primary key checkbox is checked
    if (row.primaryKey) {
        // Reset the defaultValue when primary key is checked
        row.defaultValue = '';
    }
    if(row.minLength){
      row.defaultValue = '';
    }
    if(row.maxLength){
      row.defaultValue = '';
    }
    if(row.MinRange){
      row.defaultValue = '';
    }
    if(row.MaxRange){
      row.defaultValue = '';
    }
    if(row.dateminValue){
      row.defaultValue = '';
    }
    if(row.datemaxValue){
      row.defaultValue = '';
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
    if (column.datatype === 'int' && column.MaxRange !== null && column.MinRange !== null && column.MinRange !== '' && column.MaxRange !== '') {
        const minRange = parseInt(column.MinRange);
        const maxRange = parseInt(column.MaxRange);
        if (minRange === 0 || maxRange === 0) {
            errorMessages.push('Min Range and Max Range cannot both be 0.');
            this.toastrService.showError('Min Range and Max Range cannot both be 0.');
        } else if (maxRange <= minRange) {
            errorMessages.push('Max Range must be higher than Min Range.');
            this.toastrService.showError('Max Range must be higher than Min Range.');
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
              datemaxValue:columns.datemaxValue,
              ListEntityId:parseInt(this.selectedEntity) ||0,
              ListEntityKey:this.firstColumnId ||0,
              ListEntityValue:this.selectedKeyId ||0
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
