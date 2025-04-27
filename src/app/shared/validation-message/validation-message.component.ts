import { Component, input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  imports: [ReactiveFormsModule],
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.scss',
})
export class ValidationMessageComponent {
  formGroup = input.required<FormGroup>();
  fieldName = input.required<string>();
  ngFormTemplate = input.required<FormGroupDirective>();

  arrayIndex = input<number>();
  arrayFieldName = input<string>();

  get formControl() {
    if (this.isArrayFeild) {
      return this.arrayFormControl;
    }

    return this.fieldFormControl;
  }

  protected get fieldErrors() {
    return this.fieldFormControl.errors as ValidationErrors;
  }

  private get fieldFormControl() {
    return this.formGroup().get(this.fieldName()) as FormControl;
  }

  private get arrayFormControl() {
    let formArray = this.formGroup().get(this.arrayFieldName()!) as FormArray;

    let arrayFormGroup = formArray.at(this.arrayIndex()!) as FormGroup;
    return arrayFormGroup.get(this.fieldName()) as FormControl;
  }

  private get isArrayFeild() {
    return (
      this.arrayIndex() !== undefined && this.arrayFieldName() !== undefined
    );
  }
}
