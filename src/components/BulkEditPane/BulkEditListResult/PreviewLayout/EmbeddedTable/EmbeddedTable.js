import PropTypes from 'prop-types';
import { DynamicTable } from '@folio/plugin-query-builder';

export const EmbeddedTable = ({ value, headTitles }) => {
  // Split rows by unit separator and cells by record separator + map to required format for DynamicTable
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
    />
  );
};

EmbeddedTable.propTypes = {
  value: PropTypes.string,
  headTitles: DynamicTable.propTypes.columns,
};
