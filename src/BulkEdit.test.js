import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import BulkEdit from './BulkEdit';

const renderBulkEdit = () => {
  window.history.pushState({}, 'Test page', '/bulk-edit');

  render(
    <BrowserRouter>
      <BulkEdit />
    </BrowserRouter>,
  );
};

describe('BulkEdit', () => {
  it('displays Bulk edit', () => {
    renderBulkEdit();

    expect(screen.getByText('Bulk Edit')).toBeVisible();
  });
});
