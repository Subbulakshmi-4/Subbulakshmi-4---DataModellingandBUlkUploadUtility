import { AbstractControl, ValidatorFn } from '@angular/forms';

 

export function NoIntermediateSpaceValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    if (control.value && /\s/.test(control.value)) {

      return { intermediateSpace: true };

    }

    return null;

  };

}