import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import PreviewAccordion from './PreviewAccordion';
import { RootContext } from '../../../../../context/RootContext';
import {
  getHoldingsResultsFormatterBase,
  getInventoryResultsFormatterBase,
  getUserResultsFormatterBase,
} from '../../../../../utils/formatters';

const users = [
  {
    username: 'username',
    active: true,
    barcode: '000',
    createdDate: 1641779462295,
  },
  {
    username: 'user',
    active: false,
    barcode: '111',
  },
];

const inventoryItems = [
  {
    active: true,
    barcode: '222',
    status: { name: 'active' },
    effectiveLocation: { name: 'effectiveLocation' },
    callNumber: 'callNumber',
    hrid: 'hrid',
    materialType: { name: 'materialType' },
    permanentLoanType: { name: 'permanentLoanType' },
    temporaryLoanType: { name: 'temporaryLoanType' },
    id: 'id',
    formerIds: [1, 2, 3],
    accessionNumber: 'accessionNumber',
    permanentLocation: { name: 'permanentLocation' },
    temporaryLocation: { name: 'temporaryLocation' },
    copyNumber: 'copyNumber',
    enumeration: 'enumeration',
    chronology: 'chronology',
    volume: 'volume',
  },
];

const holdingsItems = [
  {
    id: 'e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19',
    _version: 1,
    hrid: 'hrid',
    holdingsTypeId: 'holdingsTypeId',
    formerIds: [],
    instanceId: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
    permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
    permanentLocation: 'permanentLocation',
    temporaryLocationId: null,
    effectiveLocationId: null,
    electronicAccess: [],
    callNumberTypeId: '512173a7-bd09-490e-b773-17d83f2b63fe',
    callNumberPrefix: 'callNumberPrefix',
    callNumber: 'callNumber',
    callNumberSuffix: 'callNumberSuffix',
    shelvingTitle: ' TK5105.88815',
    acquisitionFormat: null,
    acquisitionMethod: null,
    receiptStatus: null,
    administrativeNotes: [],
    notes: [],
    illPolicyId: '46970b40-918e-47a4-a45d-b1677a2d3d46',
    illPolicy: null,
    retentionPolicy: null,
    digitizationPolicy: null,
    holdingsStatements: [],
    holdingsStatementsForIndexes: [],
    holdingsStatementsForSupplements: [],
    copyNumber: null,
    numberOfItems: null,
    receivingHistory: null,
    discoverySuppress: null,
    statisticalCodeIds: [
      'b5968c9e-cddc-4576-99e3-8e60aed8b0dd',
    ],
    tags: null,
    metadata: null,
    sourceId: null,
  },
];

const renderPreviewAccordion = ({
  capabilities,
  items,
  step,
  visibleColumns,
}) => {
  render(
    <MemoryRouter initialEntries={[`/bulk-edit/1/${step}?capabilities=${capabilities}`]}>
      <RootContext.Provider value={{
        setNewBulkFooterShown: jest.fn(),
        setCountOfRecords: jest.fn(),
        setVisibleColumns: jest.fn(),
        visibleColumns,
      }}
      >
        <PreviewAccordion items={items} />
      </RootContext.Provider>
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion with users on initial step', () => {
    renderPreviewAccordion({ capabilities: 'USERS', items: users, step: 'initial', visibleColumns: JSON.stringify(Object.keys(getUserResultsFormatterBase())) });

    expect(screen.getByText('username')).toBeVisible();
    expect(screen.getByText(/list.preview.title/)).toBeVisible();
    expect(screen.getByText('000')).toBeVisible();
    expect(screen.queryByText('1641779462295')).not.toBeInTheDocument();
  });

  it('should render preview accordion with users on processed step', () => {
    renderPreviewAccordion({ capabilities: 'USERS', items: users, step: 'processed', visibleColumns: JSON.stringify(Object.keys(getUserResultsFormatterBase())) });

    expect(screen.getByText('username')).toBeVisible();
    expect(screen.getByText(/list.preview.title/)).toBeVisible();
    expect(screen.getByText('000')).toBeVisible();
    expect(screen.queryByText('1641779462295')).not.toBeInTheDocument();
  });
  it('should render preview accordion with inventory items', () => {
    renderPreviewAccordion({ capabilities: 'ITEMS', items: inventoryItems, step: 'initial', visibleColumns: JSON.stringify(Object.keys(getInventoryResultsFormatterBase())) });

    expect(screen.getByText('222')).toBeVisible();
    expect(screen.getByText('active')).toBeVisible();
    expect(screen.getByText('effectiveLocation')).toBeVisible();
    expect(screen.getByText('callNumber')).toBeVisible();
    expect(screen.getByText('hrid')).toBeVisible();
    expect(screen.getByText('materialType')).toBeVisible();
    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.queryByText('1,2,3')).not.toBeInTheDocument();
  });

  it('should render preview accordion with holdings items', () => {
    renderPreviewAccordion({ capabilities: 'HOLDING', items: holdingsItems, step: 'initial', visibleColumns: JSON.stringify(Object.keys(getHoldingsResultsFormatterBase())) });

    expect(screen.getByText('hrid')).toBeVisible();
    expect(screen.getByText('permanentLocation')).toBeVisible();
    expect(screen.getByText('callNumberPrefix')).toBeVisible();
    expect(screen.getByText('callNumberSuffix')).toBeVisible();
    expect(screen.getByText('callNumber')).toBeVisible();
  });
});
