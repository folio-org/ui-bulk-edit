import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
} from '../../constants';

export const DATA_TYPES = {
  NUMERIC: 'NUMERIC',
  DATE_TIME: 'DATE_TIME',
  STRING: 'STRING',
};

const formatData = ({ capability, column, data }) => {
  const { dataType, value: field } = column;

  if (!data) return '';

  switch (true) {
    case capability === CAPABILITIES.USER && field === 'Expiration date':
      return <FormattedUTCDate value={data} />;
    case capability === CAPABILITIES.USER && field === 'Active':
      return <FormattedMessage id={`ui-bulk-edit.list.preview.table.status.${data}`} />;
    case dataType === DATA_TYPES.DATE_TIME:
      return <FolioFormattedTime dateString={data} />;
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
    selected: !cell.visible,
  }));

  const columnMapping = columns.reduce((acc, { value, label }) => {
    acc[value] = intl.formatMessage({ id: `ui-bulk-edit.columns.${capabilities}.${label}` });

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
