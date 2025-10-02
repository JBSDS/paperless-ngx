import { ObjectWithId } from './object-with-id'

export enum CustomFieldDataType {
  String = 'string',
  Url = 'url',
  Date = 'date',
  Boolean = 'boolean',
  Integer = 'integer',
  Float = 'float',
  Monetary = 'monetary',
  DocumentLink = 'documentlink',
  Select = 'select',
  LongText = 'longtext',
}

export enum CustomFieldScope {
  Document = 'document',
  Correspondent = 'correspondent',
  Both = 'both',
}

export const DATA_TYPE_LABELS = [
  {
    id: CustomFieldDataType.Boolean,
    name: $localize`Boolean`,
  },
  {
    id: CustomFieldDataType.Date,
    name: $localize`Date`,
  },
  {
    id: CustomFieldDataType.Integer,
    name: $localize`Integer`,
  },
  {
    id: CustomFieldDataType.Float,
    name: $localize`Number`,
  },
  {
    id: CustomFieldDataType.Monetary,
    name: $localize`Monetary`,
  },
  {
    id: CustomFieldDataType.String,
    name: $localize`Text`,
  },
  {
    id: CustomFieldDataType.Url,
    name: $localize`Url`,
  },
  {
    id: CustomFieldDataType.DocumentLink,
    name: $localize`Document Link`,
  },
  {
    id: CustomFieldDataType.Select,
    name: $localize`Select`,
  },
  {
    id: CustomFieldDataType.LongText,
    name: $localize`Long Text`,
  },
]

export const SCOPE_LABELS = [
  {
    id: CustomFieldScope.Document,
    name: $localize`Documents`,
  },
  {
    id: CustomFieldScope.Correspondent,
    name: $localize`Correspondents`,
  },
  {
    id: CustomFieldScope.Both,
    name: $localize`Documents & Correspondents`,
  },
]

export interface CustomField extends ObjectWithId {
  data_type: CustomFieldDataType
  scope: CustomFieldScope
  name: string
  created?: Date
  extra_data?: {
    select_options?: Array<{ label: string; id: string }>
    default_currency?: string
  }
  document_count?: number
  correspondent_count?: number
}
