import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FormattedUTCDate } from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  CRITERIA,
  CUSTOM_ENTITY_COLUMNS,
} from '../constants';
import {
  EmbeddedTable
} from '../components/BulkEditPane/BulkEditListResult/PreviewLayout/EmbeddedTable/EmbeddedTable';
import { ELECTRONIC_ACCESS_HEAD_TITLES, SUBJECT_HEAD_TITLES } from '../components/PermissionsModal/constants/lists';


export const DATA_TYPES = {
  NUMERIC: 'NUMERIC',
  DATE_TIME: 'DATE_TIME',
  STRING: 'STRING',
};

const formatData = ({ capability, column, data }) => {
  const { dataType, value: field } = column;

  if (!data) return '';

  switch (true) {
    case capability === CAPABILITIES.USER && field === CUSTOM_ENTITY_COLUMNS.EXPIRATION_DATE:
      return <FormattedUTCDate value={data} />;
    case capability === CAPABILITIES.USER && field === CUSTOM_ENTITY_COLUMNS.USER_STATUS:
      return <FormattedMessage id={`ui-bulk-edit.list.preview.table.status.${data}`} />;
    case capability === CAPABILITIES.USER && field === CUSTOM_ENTITY_COLUMNS.DATE_OF_BIRTH:
      return <FormattedUTCDate value={data} />;
    case [CAPABILITIES.INSTANCE, CAPABILITIES.ITEM].includes(capability) && [
      CUSTOM_ENTITY_COLUMNS.CATALOGED_DATE,
      CUSTOM_ENTITY_COLUMNS.MISSING_PIECES_DATE,
      CUSTOM_ENTITY_COLUMNS.ITEM_DAMAGE_STATUS_DATE,
    ].includes(field):
      return <FormattedUTCDate value={data} />;
    case dataType === DATA_TYPES.DATE_TIME:
      return <FolioFormattedTime dateString={data} />;
    case [CAPABILITIES.HOLDING, CAPABILITIES.INSTANCE].includes(capability) && field === CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS:
      return <EmbeddedTable value={data} headTitles={ELECTRONIC_ACCESS_HEAD_TITLES} />;
    case [CAPABILITIES.INSTANCE].includes(capability) && field === CUSTOM_ENTITY_COLUMNS.SUBJECT:
      return <EmbeddedTable value={data} headTitles={SUBJECT_HEAD_TITLES} />;
    default:
      return data;
  }
};

export const getMappedTableData = ({ data, capabilities, criteria, queryRecordType, intl }) => {
  if (!data) {
    return {
      contentData: null,
      formatter: null,
      columns: [],
    };
  }

  const key = criteria === CRITERIA.QUERY ? queryRecordType : capabilities;

  const columns = data.header.map((cell) => ({
    label: cell.value,
    value: cell.value,
    disabled: false,
    selected: cell.visible,
    forceSelected: cell.forceVisible,
    ignoreTranslation: cell.ignoreTranslation,
  }));

  const columnMapping = columns.reduce((acc, { value, label, ignoreTranslation }) => {
    acc[value] = ignoreTranslation ? value : intl.formatMessage({ id: `ui-bulk-edit.columns.${key}.${label}` });

    return acc;
  }, {});

  const contentData = data.rows?.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      const column = data.header[index];

      acc[column.value] = formatData({
        column,
        capability: key,
        data: item,
      });

      return acc;
    }, {});
  }) || [];

  return {
    columnMapping,
    columns,
    contentData,
  };
};

export const previewErrorsColumnsMapping = {
  type: <FormattedMessage id="ui-bulk-edit.list.errors.table.status" />,
  key: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};


