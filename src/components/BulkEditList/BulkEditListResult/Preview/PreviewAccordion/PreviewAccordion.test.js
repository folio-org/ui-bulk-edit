import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import PreviewAccordion from './PreviewAccordion';

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

const renderPreviewAccordion = ({ capabilities, items }) => {
  render(
    <MemoryRouter initialEntries={[`/bulk-edit/1?capabilities=${capabilities}`]}>
      <PreviewAccordion items={items} />
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion with users', () => {
    renderPreviewAccordion({ capabilities: 'USER', items: users });

    expect(screen.getByText('username')).toBeVisible();
    expect(screen.getByText('000')).toBeVisible();
    expect(screen.queryByText('1641779462295')).not.toBeInTheDocument();
  });

  it('should render preview accordion with inventory items', () => {
    renderPreviewAccordion({ capabilities: 'ITEM', items: inventoryItems });

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
