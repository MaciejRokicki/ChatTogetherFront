import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function SpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = new RegExp("[!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]").test(control.value);
    return result ? null : {forbiddenName: {value: control.value}};
  };
}