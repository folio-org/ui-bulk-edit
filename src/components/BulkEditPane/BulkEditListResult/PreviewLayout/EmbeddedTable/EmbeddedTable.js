import { DynamicTable, formatValueByDataType } from '@folio/plugin-query-builder';
import PropTypes from 'prop-types';

export const EmbeddedTable = ({ value, headTitles }) => {
  // Split rows by unit separator and cells by record separator + map to required format for DynamicTable
  // \u001f is non-printable character used as delimiter
  const values = value?.split('\u001f|')
    .map(row => {
      return row.split('\u001f;')
        .reduce((acc, cell, index) => {
          acc[headTitles[index].id] = cell;
          return acc;
        }, {});
    });

  return (
    <DynamicTable
      columns={headTitles}
      values={values}
      formatter={formatValueByDataType}
    />
  );
};

EmbeddedTable.propTypes = {
  value: PropTypes.string,
  headTitles: DynamicTable.propTypes.columns,
};
