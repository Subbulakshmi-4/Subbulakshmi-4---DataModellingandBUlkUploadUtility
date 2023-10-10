import { Component } from '@angular/core';
import { ColumnInputServiceService } from 'src/app/Services/column-input-service.service';
import { ToastrService } from 'src/app/Services/ToastrService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css']
})
export class CreateEntityComponent {
  entityForm: any;

  constructor( private toastrService : ToastrService,
              private router: Router,
              private  columnInputService: ColumnInputServiceService
    ){}
  selectedDataType: string = 'string'; // Default data type

  newEntity: any = {
    entityname: '',
    columns: [
      {
        columnName: '',
        datatype: 'string',
        length: 0,
        isNullable: false,
        primaryKey: false,
        defaultValue: '',
        description: ''
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
      primaryKey: false,
      defaultValue: '',
      description: ''
    });
    this.entityForm.form.updateValueAndValidity();
  }

  // Function to handle data type change
onDataTypeChange(row: any) {
  if (row.datatype === 'int' || row.datatype === 'boolean' || row.datatype === 'char' ||
      row.datatype === 'date' || row.datatype === 'bytea') {
      row.length = "";
  }
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

  // Function to check for duplicate column names
  hasDuplicateColumnNames(): boolean {
    const columnNames = new Set<string>();
    for (const row of this.newEntity.columns) {
      if (row.columnName && columnNames.has(row.columnName)) {
        return true; // Duplicate column name found
      }
      columnNames.add(row.columnName);
    }
    return false; // No duplicate column names
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

  isEntityNameValid() {
    const entityNameInput = this.newEntity.entityname;
    return !!(entityNameInput && !/[^a-zA-Z][^a-zA-Z0-9]*/.test(entityNameInput));
  }

submit() {
  const errorMessages: string[] = [];

  if(!this.isEntityNameValid()){
    errorMessages.push('Table Name patern is invalid');
    this.toastrService.showError('Table Name patern is invalid');
  }
  // Check if the table name is empty
  if (!this.newEntity.entityname) {
    errorMessages.push('Table Name is required.');
    this.toastrService.showError('Table Name is required.');
  }

  // Check for duplicate column names
  if (this.hasDuplicateColumnNames()) {
    errorMessages.push('Duplicate column names are not allowed.');
    this.toastrService.showError('Duplicate column names are not allowed.');
  }

  // Check if there's exactly one primary key
  if (!this.hasExactlyOnePrimaryKey()) {
    errorMessages.push('Exactly one Primary Key is required.');
    this.toastrService.showError('Exactly one Primary Key is required.');
  }

  // Display error messages in the console
  if (errorMessages.length > 0) {
    console.log('Form validation failed:');
    for (const errorMessage of errorMessages) {
      console.log(errorMessage);
    }
  } else {
    // Form data is valid, create and send the JSON object as needed
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
              isNullable: columns.isNullable,
              defaultValue: columns.defaultValue,
              columnPrimaryKey: columns.primaryKey,
              Description:columns.description
            };
          }),
        }
        console.log(backendRequest);
    // Call the service method to send the form data
    this.columnInputService.createTable(backendRequest).subscribe(
      response => {
        // Handle success response if needed
        console.log('Table created successfully:', response);
        this.toastrService.showSuccess('Table created successfully.');
        this.router.navigate(['/entity-list']);
      },
      error => {
        // Handle error response if needed
        console.error('Error creating table:', error);
        this.toastrService.showError('Error creating table. Table name already exists.');
      }
    );
  }
}

}
