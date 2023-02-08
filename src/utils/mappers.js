import { getFormattedColumnsDate } from './date';
import { CAPABILITIES_TRANSLATION_VALUE } from '../constants';

const DATA_TYPES = {
  NUMERIC: 'NUMERIC',
  DATE_TIME: 'DATE_TIME',
  STRING: 'STRING',
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
    const mappedCapability = CAPABILITIES_TRANSLATION_VALUE[capabilities];

    acc[value] = intl.formatMessage({ id: `ui-bulk-edit.columns.${mappedCapability}.${label}` });

    return acc;
  }, {});


  const contentData = data.rows?.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      const column = data.header[index];

      // it's required format the dates on FE side
      acc[column.value] =
        column.dataType === DATA_TYPES.DATE_TIME
          ? item ? getFormattedColumnsDate(item) : null
          : item;

      return acc;
    }, {});
  }) || [];

  return {
    columnMapping,
    columns,
    contentData,
  };
};
