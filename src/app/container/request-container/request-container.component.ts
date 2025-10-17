import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserInfoService } from '../../login/shared/user-info.service';
import ListItem from '../../shared/list-item/list-tem.model';
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

  public onClose = output();
  public onSubmit = output<ContainerRequest>();

  protected containerForm: FormGroup;

  protected get ContainerType() {
    return ContainerType;
  }
  protected get defaultClinicId() {
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

  constructor(
    private userInfo: UserInfoService,
    private formBuilder: FormBuilder
  ) {
    this.containerForm = this.createContainerRequestForm();
  }

  //#region Public Methods

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

  closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Private Methods

  private createContainerRequestForm() {
    return this.formBuilder.group({
      containerType: ['', Validators.required],
      units: ['', [Validators.required, Validators.min(1)]],
      clinicId: ['', [Validators.required]],
    });
  }
  //#endregion
}
