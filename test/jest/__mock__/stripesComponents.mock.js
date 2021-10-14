import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({
    contentLabel,
    isOpen,
    children,
  }) => <div contentLabel={contentLabel} isOpen={isOpen}>{children}</div>),
  MultiColumnList: jest.fn(({
    visibleColumns,
    columnMapping,
    isEmptyMessage,
    totalCount,
    contentData,
    formatter,
    onRowClick,
  }) => {
    if (isEmptyMessage && !totalCount) {
      return isEmptyMessage;
    }

    const tableHeader = visibleColumns.map((columnName, index) => (
      <td key={index}>{columnMapping[columnName]}</td>
    ));

    const tableBody = contentData.map((item, i) => (
      <tr key={i}>
        {onRowClick ? (
          <td>
            <button
              type="button"
              onClick={onRowClick}
            >

                row button
            </button>
          </td>
        ) : null}
        {visibleColumns.map((columnName, index) => (
          <td key={index}>
            {formatter[columnName] ? formatter[columnName](item) : item[columnName]}
          </td>
        ))}
      </tr>
    ));

    return (
      <table>
        <thead>
          <tr>
            {tableHeader}
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    );
  }),
}));
