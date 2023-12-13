import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  CUSTOM_ENTITY_COLUMNS,
} from '../../constants';
import {
  ElectronicAccessTable
} from '../../components/BulkEditList/BulkEditListResult/Preview/ElectronicAccessTable/ElectronicAccessTable';

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
    case dataType === DATA_TYPES.DATE_TIME:
      return <FolioFormattedTime dateString={data} />;
    case capability === CAPABILITIES.HOLDING && field === CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS:
      return <ElectronicAccessTable value={data} />;
    default:
      return data;
  }
};

export const getMappedTableData = ({ data, capabilities, intl }) => {
  if (!data) {
    return {
      contentData: null,
      formatter: null,
      columns: [],
    };
  }

  const columns = data.header.map((cell) => ({
    label: cell.value,
    value: cell.value,
    disabled: false,
    selected: cell.visible || cell.forceVisible,
    ignoreTranslation: cell.ignoreTranslation,
  }));

  const columnMapping = columns.reduce((acc, { value, label, ignoreTranslation }) => {
    acc[value] = ignoreTranslation ? value : intl.formatMessage({ id: `ui-bulk-edit.columns.${capabilities}.${label}` });

    return acc;
  }, {});

  const contentData = data.rows?.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      const column = data.header[index];

      acc[column.value] = formatData({
        column,
        capability: capabilities,
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


