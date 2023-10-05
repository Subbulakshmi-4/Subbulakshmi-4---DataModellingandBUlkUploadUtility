import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl,FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ColumnInputServiceService } from 'src/app/Services/column-input-service.service';
import { NoIntermediateSpaceValidator } from 'src/app/CustomValidations/no-leading-space-validator/no-leading-space-validator.component';
import { dataTypeValidator } from 'src/app/CustomValidations/data-type-validator/data-type-validator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inputcolumns',
  templateUrl: './inputcolumns.component.html',
  styleUrls: ['./inputcolumns.component.css'],
})
export class InputcolumnsComponent {
  name = 'Angular';
  tableForm: FormGroup;
  dataTypeValues: string[] = [];
  notNullValues: string[] = [];
  isChecked = false;
  selectedRadioValue: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private Inputservice: ColumnInputServiceService,
    private router: Router
  ) {
    this.tableForm = this.fb.group({
      name: ['', [Validators.required, NoIntermediateSpaceValidator()]],
      TableName: this.fb.array([]),
    });
  }

  onPrimaryKeyChange(event: any, rowIndex: number) {
    const isChecked = event.target.checked;
    const tableNameArray = this.tableForm.get('TableName') as FormArray;

    const selectedPrimaryKeys = tableNameArray.controls.reduce((count, control, index) => {
      if (index !== rowIndex && control.get('PrimaryKey')?.value === true) {
        count++;
      }
      return count;
    }, 0);

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
    if (type === 'dataType') {
      const selectedDataType = event.target.value;
      const tableNameArray = this.tableForm.get('TableName') as FormArray;
      const row = tableNameArray.at(index);
      row.get('Length')?.setValue(null);

      // Check if the selected data type is "String" and apply custom validator accordingly
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

      // Enable or disable the Length input based on the data type
      if (selectedDataType === 'Boolean') {
        row.get('Length')?.disable();
      } else {
        row.get('Length')?.enable();
      }
    }
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
      ColumnName: ['', [Validators.required, NoIntermediateSpaceValidator()]],
      DataType: ['String'],
      Length: [null, Validators.required],
      NotNull: [this.isChecked],
      Default: ['', [Validators.required, dataTypeValidator]],
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
      console.error('Form is invalid. Please correct the errors.');
    }
  }

  createTable() {
    console.log("th")
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

      this.Inputservice.createTable(backendRequest).subscribe(
        (response) => {
          console.log('Table creation successful:', response);
        },
        (error) => {
          console.error('Error creating table:', error);
        }
      );
    } else {
      console.error('Form is invalid. Please correct the errors.');
    }
  }
}
