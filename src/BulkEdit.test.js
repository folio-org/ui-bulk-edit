import React from 'react';
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

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should display correct pane titles', () => {
    renderBulkEdit();

    expect(screen.getByText(/list.logSubTitle/)).toBeVisible();
    expect(screen.getByText(/list.criteriaTitle/)).toBeVisible();
  });
});
