import { AbstractControl, ValidatorFn } from '@angular/forms';

 

export function maxLengthValidator(maxLength: number): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null => {

      const value = control.value;

      if (value !== null && value > maxLength) {

        return { maxLengthExceeded: true };

      }

      return null;

    };

  }