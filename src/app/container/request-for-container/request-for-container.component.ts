import { Component, inject, Input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ContainerType from '../shared/container-type.model';

@Component({
  selector: 'app-request-for-container',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './request-for-container.component.html',
})
export class RequestForContainerComponent {
  @Input({ required: true }) containerTypes: ContainerType[] = [];

  onClose = output();
  onSubmit = output<number>();

  private formBuilder = inject(FormBuilder);

  closeModal() {
    this.onClose.emit();
  }

  containerForm: FormGroup = this.formBuilder.group({
    containerType: ['', Validators.required],
  });

  submitForm() {
    if (this.containerForm.valid) {
      this.onSubmit.emit(
        (this.containerForm.get('containerType') as FormControl).value
      );
    }
  }

  get ContainerType() {
    return ContainerType;
  }
}
