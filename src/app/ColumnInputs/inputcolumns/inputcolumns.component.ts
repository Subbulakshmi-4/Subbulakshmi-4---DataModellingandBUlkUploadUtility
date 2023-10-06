import { Component, OnInit } from '@angular/core';

import { Directive, ElementRef, HostListener } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ChangeDetectorRef } from '@angular/core';

import { columnNameValidator } from 'src/app/CustomValidations/column-name-validator/column-name-validator.component';

import {

  FormArray,

  FormBuilder,

  FormControl,

  FormGroup,

  Validators,

  NgForm,

  AbstractControl,

  ValidatorFn,

} from '@angular/forms';

import { Router } from '@angular/router';

import { ColumnInputServiceService } from 'src/app/Services/column-input-service.service';

import { Observable } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';

import { NoIntermediateSpaceValidator } from 'src/app/CustomValidations/no-leading-space-validator/no-leading-space-validator.component';

import { dataTypeValidator } from 'src/app/CustomValidations/data-type-validator/data-type-validator.component';

import { numberValidator} from 'src/app/CustomValidations/string-validator/string-validator.component';

import { ToastrService } from 'src/app/Services/ToastrService';

import { Location } from '@angular/common';


 

@Component({

  selector: 'app-inputcolumns',

  templateUrl: './inputcolumns.component.html',

  styleUrls: ['./inputcolumns.component.css'],

})

export class InputcolumnsComponent implements OnInit{

  name = 'Angular';

  tableForm: FormGroup;

  dataTypeValues: string[] = [];

  notNullValues: string[] = [];

  isChecked = false;

  selectedRadioValue: number | null = null;

 

  constructor(

    private fb: FormBuilder,

    private http: HttpClient,

    private Inputservive: ColumnInputServiceService,

    private cdr: ChangeDetectorRef,

    private toastrService : ToastrService,

    private location: Location,
    private router: Router

  ) {

    this.tableForm = this.fb.group({

      name: ['', [Validators.required, NoIntermediateSpaceValidator(),columnNameValidator]],

      TableName: this.fb.array([]),

    });

  }

  ngOnInit(): void {

  }

 

  ngAfterViewInit() {

    console.log('Form Controls:', this.tableForm.controls);

  }

  get tableNames(): FormArray {

    return this.tableForm.get('TableName') as FormArray;

  }

 

 

  onPrimaryKeyChange(event: any, rowIndex: number) {

    const isChecked = event.target.checked;

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

 

    const selectedPrimaryKeys = tableNameArray.controls.reduce(

      (count, control, index) => {

        if (index !== rowIndex && control.get('PrimaryKey')?.value === true) {

          count++;

        }

        return count;

      },

      0

    );

    const row = tableNameArray.at(rowIndex);

    row.get('PrimaryKey')?.setValue(isChecked);

 

    if (selectedPrimaryKeys >= 2) {

      row.get('ReadOnly')?.setValue(true);

    } else {

      row.get('ReadOnly')?.setValue(false);

    }

    tableNameArray.controls.forEach((control, index) => {

      if (index !== rowIndex) {

        control.get('ReadOnly')?.setValue(selectedPrimaryKeys >= 1);

      }

    });

  }

 

onDropdownChange(event: any, type: string, index: number) {

  console.log('Dropdown changed:', event.target.value);

  if (type === 'dataType') {

    const selectedDataType = event.target.value;

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    const row = tableNameArray.at(index);

    row.get('Length')?.setValue(null);

    const lengthControl = row.get('Length');

    lengthControl?.enable();

    lengthControl?.setValidators([

      Validators.required,

      Validators.min(0),

      this.maxLengthValidator(2147483647),

    ]);

 

    if (selectedDataType === 'int') {

      row.get('Default')?.setValidators([

        Validators.required,

        Validators.pattern(/^[0-9]*$/),

      ]);

    } else if (selectedDataType === 'boolean') {

      row.get('Default')?.setValidators([Validators.required]);

    } else {

    }

    row.get('Default')?.updateValueAndValidity();

    row.get('Default')?.markAsTouched();

   

 

 

    if (selectedDataType === 'boolean'

    || selectedDataType === 'date'

    || selectedDataType === 'timestamp'

    || selectedDataType === 'char'

    || selectedDataType === 'int') {

      row.get('Length')?.disable();

      row.get('Length')?.setValue(0);

    } else {

      row.get('Length')?.enable();

    }

 

   

    if (selectedDataType === 'String') {

      const defaultControl = row.get('Default');

      defaultControl?.setValidators([

        Validators.required,

        dataTypeValidator(selectedDataType),

        this.stringOnlyValidator(),

      ]);

    } else {

      const defaultControl = row.get('Default');

      defaultControl?.setValidators([

        Validators.required,

        dataTypeValidator(selectedDataType),

      ]);

    }

    if (selectedDataType === 'date' || selectedDataType === 'timestamp' || selectedDataType === 'timestamp with time zone') {

      const formattedDate = this.formatDate(new Date());

      row.get('Default')?.setValue(formattedDate);

    }

    row.get('Default')?.updateValueAndValidity();

    console.log('Default control validators:', row.get('Default')?.errors);

  }

 

}

private formatDate(date: Date): string {

  return date.toISOString().slice(0, 10);

}

 

booleanValidator(control: AbstractControl): { [key: string]: boolean } | null {

  const value = control.value;

  if (value !== 'true' && value !== 'false') {

    return { invalidBoolean: true };

  }

  return null;

}

goBackToList(){
  this.router.navigate(['/entity-list']);
}


stringOnlyValidator() {

    return (control: AbstractControl) => {

      const value = control.value;

      if (value && !/^[a-zA-Z]+$/.test(value)) {

        return { invalidString: true };

      }

      return null;

    };

  }

 

  TableName(): FormArray {

    return this.tableForm.get('TableName') as FormArray;

  }

  onCheckboxChange(event: any, rowIndex: number) {

    const isChecked = event.target.checked;

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    const row = tableNameArray.at(rowIndex);

    row.get('NotNull')?.setValue(isChecked);

  }

 

  newQuantity(): FormGroup {

    return this.fb.group({

      ColumnName: ['', [Validators.required, NoIntermediateSpaceValidator(),columnNameValidator]],

      DataType: ['String'],

      Length: [null, Validators.required],

      NotNull: [this.isChecked],

      Default: ['', [Validators.required, this.booleanValidator,numberValidator()]],

      PrimaryKey: [false],

    });

  }

  get tableNameControls(): AbstractControl[] {

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    return tableNameArray.controls;

  }

  addQuantity() {

    const newFormGroup = this.newQuantity();

    this.TableName().push(newFormGroup);

 

    if (this.TableName().length === 1) {

      this.onRadioChange(0);

    }

  }

  updateDefaultValidation(index: number) {

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    const row = tableNameArray.at(index);

    const length = row.get('Length')?.value;

    const dataType = row.get('DataType')?.value;

 

    if (length) {

      const defaultControl = row.get('Default');

      defaultControl?.setValidators([

        Validators.required,

        dataTypeValidator(dataType),

        this.lengthValidator(length),

      ]);

 

      defaultControl?.updateValueAndValidity();

      this.cdr.markForCheck();

      console.log(defaultControl?.errors);

    }

  }

 

  lengthValidator(maxLength: number) {

    return (control: AbstractControl) => {

      const value = control.value;

      if (value && value.toString().length > maxLength) {

        return { invalidLength: true };

      }

      return null;

    };

  }

  onLengthChange(event: any, rowIndex: number) {

    this.updateDefaultValidation(rowIndex);

  }

 

  removeQuantity(i: number) {

    if (this.selectedRadioValue === i) {

      this.selectedRadioValue = null;

    }

    this.TableName().removeAt(i);

  }

 

  onRadioChange(index: number) {

    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    const selectedRow = tableNameArray.at(index);

    selectedRow.get('PrimaryKey')?.setValue(true);

    tableNameArray.controls.forEach((control, i) => {

      if (i !== index) {

        control.get('PrimaryKey')?.setValue(false);

      }

    });

    this.selectedRadioValue = index;

  }

  onSubmit() {

    if (this.tableForm.valid) {

      this.createTable();

    } else {

      this.toastrService.showError('Form is invalid. Please correct the errors.', 'Error');

    }

  }

 
  async createTable() {

    try {

      if (this.tableForm.valid) {

        const formData = this.tableForm.value;

        const backendRequest = {

          tableName: formData.name,

          columns: formData.TableName.map((tableRow: any) => {

            return {

              entityColumnName: tableRow.ColumnName,

              dataType: tableRow.DataType,

              length: tableRow.Length || 0,

              isNullable: !tableRow.NotNull,

              defaultValue: tableRow.Default,

              columnPrimaryKey: tableRow.PrimaryKey,

            };

          }),

        };

       

        const response = await this.Inputservive.createTable(backendRequest).toPromise();

        this.toastrService.showSuccess('Table created successfully');

        await new Promise(resolve => setTimeout(resolve, 3000));

        window.location.reload();

      } 

    } catch (error) {

      console.error('Error creating table:', error);

      this.toastrService.showError('Error creating table:');

    }

  }

  updateForm() {

    this.cdr.detectChanges();

  }

 

  //cutsom validation

  maxLengthValidator(maxLength: number): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null => {

      const value = control.value;

      if (value !== null && value > maxLength) {

        return { maxLengthExceeded: true };

      }

      return null;

    };

  }

 

}