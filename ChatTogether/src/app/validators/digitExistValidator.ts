import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function DigitExistValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = new RegExp("[0-9]").test(control.value);
    return result ? null : {DigitExistValidator: false};
  };
}