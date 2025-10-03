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
  { id: 'relationship', name: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.relationship" />, styles: { width: '15%' } },
  { id: 'uri', name: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.uri" />, styles: { width: '30%' } },
  { id: 'linkText', name: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.linkText" />, width: '15%' },
  { id: 'materialsSpecified', name: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.materialsSpecified" />, styles: { width: '15%' } },
  { id: 'publicNote', name: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.publicNote" />, styles: { width: '20%' } },
];

export const SUBJECT_HEAD_TITLES = [
  { id: 'subjectHeadings', name: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectHeadings" />, styles: { width: '35%' } },
  { id: 'subjectSource', name: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectSource" />, styles: { width: '35%' } },
  { id: 'subjectType', name: <FormattedMessage id="ui-bulk-edit.list.preview.subject.subjectType" />, styles: { width: '30%' } },
];

export const CLASSIFICATION_HEAD_TITLES = [
  { id: 'identifierType', name: <FormattedMessage id="ui-bulk-edit.list.preview.classification.identifierType" />, styles: { width: '30%' } },
  { id: 'classification', name: <FormattedMessage id="ui-bulk-edit.list.preview.classification.classification" />, styles: { width: '70%' } },
];

export const PUBLICATION_HEAD_TITLES = [
  { id: 'publisher', name: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publisher" />, styles: { width: '25%' } },
  { id: 'publisherRole', name: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publisherRole" />, styles: { width: '25%' } },
  { id: 'placeOfPublication', name: <FormattedMessage id="ui-bulk-edit.list.preview.publication.placeOfPublication" />, styles: { width: '25%' } },
  { id: 'publicationDate', name: <FormattedMessage id="ui-bulk-edit.list.preview.publication.publicationDate" />, styles: { width: '25%' } },
];

export const PREVIEW_COLUMN_WIDTHS = {
  [CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS]: '850px',
  [CUSTOM_ENTITY_COLUMNS.SUBJECT]: '600px',
  [CUSTOM_ENTITY_COLUMNS.CLASSIFICATION]: '400px',
  [CUSTOM_ENTITY_COLUMNS.PUBLICATION]: '700px',
};
