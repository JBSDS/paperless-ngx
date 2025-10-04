import { Component, inject } from '@angular/core'
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { CustomField } from 'src/app/data/custom-field'
import { CustomFieldDataType, CustomFieldScope } from 'src/app/data/custom-field'
import { CustomFieldInstance } from 'src/app/data/custom-field-instance'
import { Correspondent } from 'src/app/data/correspondent'
import { DEFAULT_MATCHING_ALGORITHM } from 'src/app/data/matching-model'
import { IfOwnerDirective } from 'src/app/directives/if-owner.directive'
import { CorrespondentService } from 'src/app/services/rest/correspondent.service'
import { CustomFieldsService } from 'src/app/services/rest/custom-fields.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { takeUntil } from 'rxjs'
import { CheckComponent } from '../../input/check/check.component'
import { DateComponent } from '../../input/date/date.component'
import { DocumentLinkComponent } from '../../input/document-link/document-link.component'
import { MonetaryComponent } from '../../input/monetary/monetary.component'
import { PermissionsFormComponent } from '../../input/permissions/permissions-form/permissions-form.component'
import { SelectComponent } from '../../input/select/select.component'
import { TextComponent } from '../../input/text/text.component'
import { TextAreaComponent } from '../../input/textarea/textarea.component'
import { NumberComponent } from '../../input/number/number.component'
import { UrlComponent } from '../../input/url/url.component'
import { CustomFieldsDropdownComponent } from '../../custom-fields-dropdown/custom-fields-dropdown.component'

@Component({
  selector: 'pngx-correspondent-edit-dialog',
  templateUrl: './correspondent-edit-dialog.component.html',
  styleUrls: ['./correspondent-edit-dialog.component.scss'],
  imports: [
    CheckComponent,
    NumberComponent,
    DateComponent,
    MonetaryComponent,
    UrlComponent,
    DocumentLinkComponent,
    SelectComponent,
    PermissionsFormComponent,
    TextComponent,
    TextAreaComponent,
    CustomFieldsDropdownComponent,
    IfOwnerDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CorrespondentEditDialogComponent extends EditDialogComponent<Correspondent> {
  CustomFieldDataType = CustomFieldDataType
  CustomFieldScope = CustomFieldScope

  private customFieldsService = inject(CustomFieldsService)

  private initialCustomFieldInstances: CustomFieldInstance[] = []
  private customFieldMap = new Map<number, CustomField>()

  constructor() {
    super()
    this.service = inject(CorrespondentService)
    this.userService = inject(UserService)
    this.settingsService = inject(SettingsService)
  }

  override ngOnInit(): void {
    // Always clear the form array first to prevent duplicates from previous modal instances
    this.customFieldsFormArray.clear({ emitEvent: false })

    if (this.object?.custom_fields) {
      this.initialCustomFieldInstances = this.object.custom_fields
      delete (this.object as any).custom_fields
    }
    super.ngOnInit()
    this.loadCustomFields()
  }

  getCreateTitle() {
    return $localize`Create new correspondent`
  }

  getEditTitle() {
    return $localize`Edit correspondent`
  }

  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      matching_algorithm: new FormControl(DEFAULT_MATCHING_ALGORITHM),
      match: new FormControl(''),
      is_insensitive: new FormControl(true),
      permissions_form: new FormControl(null),
      custom_fields: new FormArray([]),
    })
  }

  get customFieldsFormArray(): FormArray {
    return this.objectForm.get('custom_fields') as FormArray
  }

  get existingCustomFieldInstances(): CustomFieldInstance[] {
    return this.customFieldsFormArray.controls.map((control) => ({
      field: control.get('field')?.value,
    })) as CustomFieldInstance[]
  }

  private loadCustomFields() {
    this.customFieldsService
      .listAll()
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((result) => {
        result.results.forEach((field) =>
          this.customFieldMap.set(field.id, field)
        )
        this.populateInitialCustomFields()
      })
  }

  private populateInitialCustomFields() {
    if (this.initialCustomFieldInstances.length === 0) {
      return
    }
    this.initialCustomFieldInstances.forEach((instance) => {
      const field = this.getCustomFieldDefinition(instance.field)
      if (!field) {
        return
      }
      const alreadyExists = this.customFieldsFormArray.controls.some(
        (control) => control.get('field')?.value === field.id
      )
      if (alreadyExists) {
        return
      }
      this.customFieldsFormArray.push(
        this.createCustomFieldFormGroup(field, instance.value),
        { emitEvent: false }
      )
    })
    this.initialCustomFieldInstances = []
  }

  addCustomField(field: CustomField) {
    const alreadyExists = this.customFieldsFormArray.controls.some(
      (control) => control.get('field')?.value === field.id
    )
    if (alreadyExists) {
      return
    }
    this.customFieldMap.set(field.id, field)
    this.customFieldsFormArray.push(
      this.createCustomFieldFormGroup(field, this.defaultValueForField(field)),
    )
    this.markCustomFieldsAsDirty()
  }

  onCustomFieldCreated(field: CustomField) {
    this.customFieldMap.set(field.id, field)
  }

  removeCustomField(index: number) {
    this.customFieldsFormArray.removeAt(index)
    this.markCustomFieldsAsDirty()
  }

  getCustomFieldDefinition(fieldId: number): CustomField | undefined {
    return this.customFieldMap.get(fieldId)
  }

  getCustomFieldError(index: number) {
    const fieldError = this.error?.custom_fields?.[index]
    return fieldError?.['non_field_errors'] ?? fieldError?.['value']
  }

  private createCustomFieldFormGroup(field: CustomField, value: any) {
    return new FormGroup({
      field: new FormControl(field.id),
      value: new FormControl(
        value !== undefined ? value : this.defaultValueForField(field)
      ),
    })
  }

  private defaultValueForField(field: CustomField) {
    switch (field.data_type) {
      case CustomFieldDataType.Boolean:
        return false
      case CustomFieldDataType.DocumentLink:
        return []
      default:
        return null
    }
  }

  private markCustomFieldsAsDirty() {
    this.customFieldsFormArray.markAsDirty()
    this.customFieldsFormArray.updateValueAndValidity()
  }
}
