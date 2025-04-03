import React from 'react';
import PropTypes from 'prop-types';
import css from './EmbeddedTable.css';

export const EmbeddedTable = ({ value, headTitles }) => {
  const tableBodyRows = value?.split('\u001f|')
    .map(row => row.split('\u001f;'));

  return (
    <table className={css.EmbeddedTable}>
      <thead>
        <tr>{headTitles.map((cell, index) => (
          <th
            key={cell.key + index}
            style={{ width: cell.width }}
          >
            {cell.value}
          </th>
        ))}
        </tr>
      </thead>
      <tbody>
        {tableBodyRows.map((row, index) => (
          <tr key={`${row}-${index}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${index}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

EmbeddedTable.propTypes = {
  value: PropTypes.string,
  headTitles: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
    width: PropTypes.string,
  })),
};
