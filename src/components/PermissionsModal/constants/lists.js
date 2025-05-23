import { FormattedMessage } from 'react-intl';
import { CUSTOM_ENTITY_COLUMNS } from '../../../constants';

export const COLUMNS_KEYS = {
  SELECTED: 'selected',
  NAME: 'permissionName',
  TYPE: 'type',
  STATUS: 'status',
};

export const VISIBLE_COLUMNS = Object.values(COLUMNS_KEYS);

export const PERMISSIONS_COLUMN_WIDTHS = {
  selected: '5',
  permissionName: '55',
  type: '20',
  status: '20',
};

export const ELECTRONIC_ACCESS_HEAD_TITLES = [
  { key: 'relationship', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.relationship" />, width: '15%' },
  { key: 'uri', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.uri" />, width: '30%' },
  { key: 'linkText', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.linkText" />, width: '15%' },
  { key: 'materialsSpecified', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.materialsSpecified" />, width: '15%' },
  { key: 'publicNote', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.publicNote" />, width: '20%' },
];

export const SUBJECT_HEAD_TITLES = [
  { key: 'subjectHeadings', value: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectHeadings" />, width: '35%' },
  { key: 'subjectSource', value: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectSource" />, width: '35%' },
  { key: 'subjectType', value: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectType" />, width: '30%' },
];

export const CLASSIFICATION_HEAD_TITLES = [
  { key: 'identifierType', value: <FormattedMessage id="ui-bulk-edit.list.preview.classification.identifierType" />, width: '30%' },
  { key: 'classification', value: <FormattedMessage id="ui-bulk-edit.list.preview.classification.classification" />, width: '70%' },
];

export const PUBLICATION_HEAD_TITLES = [
  { key: 'publisher', value: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publisher" />, width: '25%' },
  { key: 'publisherRole', value: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publisherRole" />, width: '25%' },
  { key: 'placeOfPublication', value: <FormattedMessage id="ui-bulk-edit.list.preview.publication.placeOfPublication" />, width: '25%' },
  { key: 'publicationDate', value: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publicationDate" />, width: '25%' },
];

export const PREVIEW_COLUMN_WIDTHS = {
  [CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS]: '850px',
  [CUSTOM_ENTITY_COLUMNS.SUBJECT]: '600px',
  [CUSTOM_ENTITY_COLUMNS.CLASSIFICATION]: '400px',
};
