import { CustomFieldInstance } from './custom-field-instance'
import { MatchingModel } from './matching-model'

export interface Correspondent extends MatchingModel {
  last_correspondence?: string // Date
  custom_fields?: CustomFieldInstance[]
}
