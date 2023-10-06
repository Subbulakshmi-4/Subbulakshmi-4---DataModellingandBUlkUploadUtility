import { AbstractControl } from '@angular/forms';

 

export function columnNameValidator(control: AbstractControl): { [key: string]: boolean } | null {

  const columnName = control.value;

  if (columnName && (/^\d/.test(columnName) || /[^\w]/.test(columnName))) {

    return { invalidColumnName: true };

  }

  return null;

}