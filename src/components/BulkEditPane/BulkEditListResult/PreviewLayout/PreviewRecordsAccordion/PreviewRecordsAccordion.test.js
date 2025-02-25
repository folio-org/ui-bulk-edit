import { render, screen } from '@testing-library/react';

import '../../../../../../test/jest/__mock__';

import { PreviewRecordsAccordion } from './PreviewRecordsAccordion';
import { RootContext } from '../../../../../context/RootContext';

const users = [
  {
    username: 'username',
    active: 'true',
    barcode: '000',
    createdDate: 1641779462295,
  },
  {
    username: 'user',
    active: 'false',
    barcode: '111',
  },
];

const inventoryItems = [
  {
    active: 'true',
    barcode: '222',
    status: 'active',
    callNumber: 'callNumber',
    hrid: 'hrid',
    id: 'id',
    accessionNumber: 'accessionNumber',
    permanentLocation: 'permanentLocation',
    temporaryLocation: 'temporaryLocation',
    copyNumber: 'copyNumber',
    enumeration: 'enumeration',
    chronology: 'chronology',
    volume: 'volume',
  },
];

const holdingsItems = [
  {
    id: 'e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19',
    hrid: 'hrid',
    holdingsTypeId: 'holdingsTypeId',
    instanceId: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
    permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
    permanentLocation: 'permanentLocation',
    callNumberTypeId: '512173a7-bd09-490e-b773-17d83f2b63fe',
    callNumberPrefix: 'callNumberPrefix',
    callNumber: 'callNumber',
    callNumberSuffix: 'callNumberSuffix',
    shelvingTitle: 'TK5105.88815',
    illPolicyId: '46970b40-918e-47a4-a45d-b1677a2d3d46',
  },
];

const renderPreviewAccordion = ({
  items,
  visibleColumns,
  initial = true,
}) => {
  const columnMapping = visibleColumns.reduce((acc, column) => {
    acc[column.value] = `${column.value} header`;

    return acc;
  }, {});

  render(
    <RootContext.Provider value={{
      setCountOfRecords: jest.fn(),
      setVisibleColumns: jest.fn(),
      visibleColumns,
    }}
    >
      <PreviewRecordsAccordion
        contentData={items}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        initial={initial}
        step="UPLOAD"
      />
    </RootContext.Provider>,
  );
};

describe('PreviewAccordion', () => {
  it('should display correct title for matched preview', () => {
    renderPreviewAccordion({
      items: [],
      visibleColumns: [],
      initial: true,
    });

    expect(screen.getByText(/list.preview.title/)).toBeVisible();
  });

  it('should display correct title for results preview', () => {
    renderPreviewAccordion({
      items: [],
      visibleColumns: [],
      initial: false,
    });

    expect(screen.getByText(/list.preview.titleChanged/)).toBeVisible();
  });

  it('should render preview accordion with users on initial step', () => {
    const user = users[0];
    const visibleColumns = Object.keys(user).map(column => ({ value: column, selected: true }));

    renderPreviewAccordion({
      items: users,
      visibleColumns,
    });

    Object.values(user).forEach(itemFieldValue => {
      expect(screen.getByText(itemFieldValue)).toBeVisible();
    });
  });

  it('should render preview accordion with inventory items', () => {
    const item = inventoryItems[0];
    const visibleColumns = Object.keys(item).map(column => ({ value: column, selected: true }));

    renderPreviewAccordion({
      items: inventoryItems,
      visibleColumns,
    });

    Object.values(item).forEach(itemFieldValue => {
      expect(screen.getByText(itemFieldValue)).toBeVisible();
    });
  });

  it('should render preview accordion with holding items', () => {
    const holding = holdingsItems[0];
    const visibleColumns = Object.keys(holding).map(column => ({ value: column, selected: true }));

    renderPreviewAccordion({
      items: holdingsItems,
      visibleColumns,
    });

    Object.values(holding).forEach(itemFieldValue => {
      expect(screen.getByText(itemFieldValue)).toBeVisible();
    });
  });
});
