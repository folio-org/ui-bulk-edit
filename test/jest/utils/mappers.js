import moment from 'moment/moment';
import { baseFormat } from '../../../src/constants';

window.moment = moment;

const DATA_TYPES = {
  NUMERIC: 'NUMERIC',
  DATE_TIME: 'DATE_TIME',
  STRING: 'STRING',
};

export const getMappedTableData = (data) => {
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

  const columnsMapping = columns.reduce((acc, { value }) => {
    acc[value] = item => item[value];

    return acc;
  }, {});


  const contentData = data.rows?.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      const column = data.header[index];
      // it's required format the dates on FE side
      acc[column.value] =
        column.dataType === DATA_TYPES.DATE_TIME
          ? moment(item).format(`${baseFormat} HH:mm:ss`)
          : item;

      return acc;
    }, {});
  }) || [];

  return {
    columnsMapping,
    columns,
    contentData,
  };
};
