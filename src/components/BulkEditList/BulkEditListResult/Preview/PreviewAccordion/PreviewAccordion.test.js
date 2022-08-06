import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import PreviewAccordion from './PreviewAccordion';
import { RootContext } from '../../../../../context/RootContext';
import { getInventoryResultsFormatterBase, getUserResultsFormatterBase } from '../../../../../constants/formatters';

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
});
