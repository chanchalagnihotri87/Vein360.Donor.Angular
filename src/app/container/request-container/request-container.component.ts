import { Component, inject, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import ListItem from '../../donation/shared/list-tem.model';
import { UserInfoService } from '../../login/shared/user-info.service';
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

  onClose = output();
  onSubmit = output<ContainerRequest>();

  public containerForm: FormGroup;

  private formBuilder = inject(FormBuilder);

  constructor(private userInfo: UserInfoService) {
    this.containerForm = this.createContainerRequestForm();
  }

  closeModal() {
    this.onClose.emit();
  }

  ngOnInit(): void {
    if (this.defaultClinicId) {
      this.containerForm.patchValue({ clinicId: this.defaultClinicId });
    }
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

  get defaultClinicId() {
    if (
      this.userInfo.defaultClinicId() &&
      this.clinics.filter((x) => x.id == this.userInfo.defaultClinicId())
        .length > 0
    ) {
      return this.userInfo.defaultClinicId();
    }

    if (this.clinics.length > 0) {
      return this.clinics[0].id;
    }

    return undefined;
  }

  private createContainerRequestForm() {
    return this.formBuilder.group({
      containerType: ['', Validators.required],
      units: ['', [Validators.required, Validators.min(1)]],
      clinicId: ['', [Validators.required]],
    });
  }
}
