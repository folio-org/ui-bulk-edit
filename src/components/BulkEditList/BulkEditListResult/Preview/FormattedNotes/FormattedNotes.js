import React from 'react';

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse'
}

const cellStyles = {
  border: '1px solid',
  padding: '0 4px',
  maxWidth: '200px',
}

const ignoredContent = ['false'];

export const FormattedNotes = ({ notes }) => {
  if (!notes) return null;


  const tableData = notes.split('|')
    .map(i => i.split(';').filter(i => !ignoredContent.includes(i)))
    .reduce((acc, elem) => {
      const [head, ...content] = elem;

      acc[head] = content.join(';');

      return acc;
    }, {});

  const renderCell = (item, key, tag) => {
    return React.createElement(tag, { key, style: cellStyles }, item);
  };

  const renderHead = () => {
    return Object.keys(tableData).map((item, key) => renderCell(item, key, 'th'));
  }

  const renderBody = () => {
    return Object.values(tableData).map((item, key) => renderCell(item, key, 'td'));
  };

  return (
    <table style={tableStyles}>
      <thead><tr>{renderHead()}</tr></thead>
      <tbody><tr>{renderBody()}</tr></tbody>
    </table>
  )
};
