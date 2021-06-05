import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function UpperCaseCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = new RegExp("[A-Z]").test(control.value);
    return result ? null : {forbiddenName: {value: control.value}};
  };
}