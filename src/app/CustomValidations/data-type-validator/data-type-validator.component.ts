import { AbstractControl, ValidatorFn } from '@angular/forms';

 

export function dataTypeValidator(dataType: string): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    const value = control.value;

 

    if (dataType === 'Number' && value && isNaN(Number(value))) {

      console.log(dataType)

      return { invalidNumber: true };

    }

 

    return null;

  };

}