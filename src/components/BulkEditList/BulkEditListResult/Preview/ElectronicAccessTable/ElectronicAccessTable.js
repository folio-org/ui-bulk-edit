import React from 'react';
import PropTypes from 'prop-types';
import { ELECTRONIC_ACCESS_HEAD } from '../../../../PermissionsModal/constants/lists';
import css from './ElectronicAcess.css';

export const ElectronicAccessTable = ({ value }) => {
  const tableBodyRows = value?.split('|')
    .map(row => {
      const cells = row.split(';');
      const [uri, linkText, materialsSpecified, publicNote, relationship] = cells;

      return [relationship, uri, linkText, materialsSpecified, publicNote];
    });

  return (
    <table className={css.ElectronicAccess}>
      <thead>
        <tr>{ELECTRONIC_ACCESS_HEAD.map((cell, index) => <th key={index}>{cell}</th>)}</tr>
      </thead>
      <tbody>
        {tableBodyRows.map((row, index) => <tr key={index}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  );
};

ElectronicAccessTable.propTypes = {
  value: PropTypes.string,
};
