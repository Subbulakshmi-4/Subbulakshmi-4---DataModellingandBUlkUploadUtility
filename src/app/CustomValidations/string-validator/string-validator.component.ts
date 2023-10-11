import { AbstractControl, ValidatorFn } from '@angular/forms';

 

export function numberValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    const valid = /^[0-9]*$/.test(control.value);

    console.log(valid)

    return valid ? null : { invalidNumber: true };

  };

}