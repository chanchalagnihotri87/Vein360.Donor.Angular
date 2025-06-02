import { Component, inject, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ListItem from '../../donation/shared/list-tem.model';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ContainerRequest from '../shared/container-request.model';
import ContainerType from '../shared/container-type.model';

@Component({
  selector: 'app-request-for-container',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './request-container.component.html',
})
export class RequestContainerComponent implements OnInit {
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) clinics: ListItem[] = [];
  @Input({ required: true }) defaultClinicId: number = 0;

  onClose = output();
  onSubmit = output<ContainerRequest>();

  public containerForm: FormGroup;

  private formBuilder = inject(FormBuilder);

  constructor() {
    this.containerForm = this.createContainerRequestForm();
  }

  closeModal() {
    this.onClose.emit();
  }

  ngOnInit(): void {
    this.containerForm.patchValue({ clinicId: this.defaultClinicId });
  }

  submitForm() {
    if (this.containerForm.valid) {
      this.onSubmit.emit(
        new ContainerRequest(
          this.containerForm.value.containerType,
          this.containerForm.value.units,
          this.containerForm.value.clinicId
        )
      );
    }
  }

  get ContainerType() {
    return ContainerType;
  }

  private createContainerRequestForm() {
    return this.formBuilder.group({
      containerType: ['', Validators.required],
      units: ['', [Validators.required, Validators.min(1)]],
      clinicId: ['', [Validators.required]],
    });
  }
}
