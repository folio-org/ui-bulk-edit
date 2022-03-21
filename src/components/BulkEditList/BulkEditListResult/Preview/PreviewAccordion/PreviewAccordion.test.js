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
    createdDate: 1641779462295,
  },
  {
    active: false,
    barcode: '333',
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

    expect(screen.getByText('username'));
  });

  it('should render preview accordion with inventory items', () => {
    renderPreviewAccordion({ capabilities: 'USER', items: inventoryItems });

    expect(screen.getByText('222'));
  });
});
