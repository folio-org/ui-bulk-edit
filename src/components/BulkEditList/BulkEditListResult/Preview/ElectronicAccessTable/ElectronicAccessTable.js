import React from 'react';
import PropTypes from 'prop-types';
import { ELECTRONIC_ACCESS_HEAD_TITLES } from '../../../../PermissionsModal/constants/lists';
import css from './ElectronicAcess.css';

export const ElectronicAccessTable = ({ value }) => {
  const tableBodyRows = value?.split('\u001f|')
    .map(row => row.split('\u001f;'));

  return (
    <table className={css.ElectronicAccess}>
      <thead>
        <tr>{ELECTRONIC_ACCESS_HEAD_TITLES.map((cell, index) => <th key={cell.key + index}>{cell.value}</th>)}</tr>
      </thead>
      <tbody>
        {tableBodyRows.map((row, index) => <tr key={`${row}-${index}`}>{row.map((cell, cellIndex) => <td key={`cell-${index}-${cellIndex}`}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  );
};

ElectronicAccessTable.propTypes = {
  value: PropTypes.string,
};
